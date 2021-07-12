package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"time"

	socketio "github.com/googollee/go-socket.io"
	"github.com/googollee/go-socket.io/engineio"
	"github.com/joho/godotenv"
	things "github.com/thingsdb/go-thingsdb"
)

// AppVersion exposes version information
const AppVersion = "0.4.3"

// For backwards compatability
var oldConnFile = ".things-gui_config"

var connFile = ".config/ThingsGUI/thingsgui.connections"
var sessionFile = ".config/ThingsGUI/thingsgui.session"
var lastUsedKey = "lastUsedKey"
var cookieName = "uid"
var cookieMaxAge = 6048000 // (seconds) 10 weeks

var (
	// env variables
	thingsguiAddress    string
	thingsguiAuthMethod string
	thingsguiSsl        bool
	thingsguiAic        bool
	thingsguiTokenApi   string
	useLocalSession     bool
	useCookieSession    bool
)

// App type
type App struct {
	client             map[string]*Client
	disableOpenBrowser bool
	envPath            string
	host               string
	port               uint16
	server             *socketio.Server
	timeout            uint16
}

// Init parses the flags
func (app *App) Init() {
	var port uint
	var timeout uint

	flag.StringVar(&app.host, "host", "localhost", "Specific host for the http webserver.")
	flag.StringVar(&app.envPath, "env", ".env", "Path of .env file.")
	flag.UintVar(&port, "port", 5000, "Specific port for the http webserver.")
	flag.UintVar(&timeout, "timeout", 0, "Connect and query timeout in seconds")
	flag.BoolVar(&app.disableOpenBrowser, "disable-open-browser", false, "opens ThingsGUI in your default browser")
	flag.Parse()

	app.port = uint16(port)
	app.timeout = uint16(timeout)
}

// SocketRouter socketio
func (app *App) SocketRouter() {
	app.server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		app.client[s.ID()] = &Client{
			Closed:          make(chan bool),
			LogCh:           make(chan string),
			EventCh:         make(chan *things.Event),
			TmpFiles:        NewTmpFiles(),
			ConnectionsPath: GetHomePath(connFile),
			SessionPath:     GetHomePath(sessionFile),
		}

		lCh := app.client[s.ID()].LogCh
		go func() {
			for p := range lCh {
				s.Emit("logging", p)
			}
		}()

		eCh := app.client[s.ID()].EventCh
		go func() {
			for p := range eCh {
				_, err := app.client[s.ID()].TmpFiles.ReplaceBinStrWithLink(p.Data)
				if err != nil {
					lCh <- err.Error()
				}
				s.Emit("event", p)
			}
		}()

		lCh <- fmt.Sprintf("connected: %s", s.ID())
		return nil
	})

	app.server.OnEvent("/", "authKey", func(s socketio.Conn, data map[string]string) (int, interface{}, Message) {
		return AuthKey(app.client[s.ID()], data, thingsguiAddress, thingsguiSsl, thingsguiAic, thingsguiTokenApi)
	})

	app.server.OnEvent("/", "authOnly", func(s socketio.Conn) (int, AuthResp, Message) {
		return AuthOnly(thingsguiAddress, thingsguiAuthMethod)
	})

	app.server.OnEvent("/", "authToken", func(s socketio.Conn, data map[string]string) (int, interface{}, Message) {
		return AuthToken(app.client[s.ID()], data, thingsguiAddress, thingsguiSsl, thingsguiAic)
	})

	app.server.OnEvent("/", "authPass", func(s socketio.Conn, data map[string]string) (int, interface{}, Message) {
		return AuthPass(app.client[s.ID()], data, thingsguiAddress, thingsguiSsl, thingsguiAic)
	})

	app.server.OnEvent("/", "cookie", func(s socketio.Conn, cookies string) int {
		client := app.client[s.ID()]
		if useCookieSession && client.Cookie == nil {
			header := s.RemoteHeader()
			header.Set("Cookie", cookies)
			req := http.Request{Header: header}
			cookie, _ := req.Cookie(cookieName)
			client.Cookie = cookie
		}
		return http.StatusNoContent
	})

	app.server.OnEvent("/", "connected", func(s socketio.Conn) (int, LoginResp, Message) {
		client := app.client[s.ID()]
		if client.Cookie == nil {
			req := http.Request{Header: s.RemoteHeader()}
			cookie, _ := req.Cookie(cookieName)
			client.Cookie = cookie
		}
		return Connected(client)
	})

	app.server.OnEvent("/", "connToNew", func(s socketio.Conn, data LoginData) (int, LoginResp, Message) {
		return ConnectToNew(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "connViaCache", func(s socketio.Conn, data LoginData) (int, LoginResp, Message) {
		return ConnectViaCache(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "reconn", func(s socketio.Conn) (int, LoginResp, Message) {
		return Reconnect(app.client[s.ID()])
	})

	app.server.OnEvent("/", "disconn", func(s socketio.Conn) (int, LoginResp, Message) {
		return Disconnect(app.client[s.ID()])
	})

	app.server.OnEvent("/", "getCachedConn", func(s socketio.Conn) (int, interface{}, Message) {
		return GetCachedConnections(app.client[s.ID()])
	})

	app.server.OnEvent("/", "newCachedConn", func(s socketio.Conn, data LData) (int, interface{}, Message) {
		return NewCachedConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "editCachedConn", func(s socketio.Conn, data LData) (int, interface{}, Message) {
		return EditCachedConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "renameCachedConn", func(s socketio.Conn, data LData) (int, interface{}, Message) {
		return RenameCachedConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "delCachedConn", func(s socketio.Conn, data LoginData) (int, interface{}, Message) {
		return DelCachedConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "query", func(s socketio.Conn, data Data) (int, interface{}, Message) {
		return Query(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "cleanupTmp", func(s socketio.Conn) (int, bool, Message) {
		return CleanupTmp(app.client[s.ID()].TmpFiles)
	})

	app.server.OnEvent("/", "watch", func(s socketio.Conn, data Data) (int, interface{}, Message) {
		return Watch(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "unwatch", func(s socketio.Conn, data Data) (int, interface{}, Message) {
		return Unwatch(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "run", func(s socketio.Conn, data Data) (int, interface{}, Message) {
		return Run(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Printf("meet error: %s\n", e.Error())
	})

	app.server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		app.client[s.ID()].LogCh <- fmt.Sprintf("closed: %s", msg)
		app.client[s.ID()].TmpFiles.CleanupTmp()

		CloseSingleConn(app.client[s.ID()])
		delete(app.client, s.ID())
	})
}

func open(url string) error { //https://stackoverflow.com/questions/39320371/how-start-web-server-to-open-page-in-browser-in-golang
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Run()
}

func (app *App) getEnvVariables() error {
	godotenv.Load(app.envPath)
	thingsguiAddress = os.Getenv("THINGSGUI_ADDRESS")
	thingsguiAuthMethod = os.Getenv("THINGSGUI_AUTH_METHOD")
	if os.Getenv("THINGSGUI_SSL") == "true" {
		thingsguiSsl = true
		if os.Getenv("THINGSGUI_AIC") == "true" {
			thingsguiAic = true
		}

	}
	thingsguiTokenApi = os.Getenv("THINGSGUI_TOKEN_API")

	if os.Getenv("USE_COOKIE_SESSION") == "true" {
		useCookieSession = true
	}

	if os.Getenv("USE_LOCAL_SESSION") == "true" {
		useLocalSession = true
	}

	return nil
}

func (app *App) quit() {
	for _, v := range app.client {
		if v != nil {
			v.TmpFiles.CleanupTmp()
			if v.Connection != nil {
				v.Connection.Close()
			}
		}
	}
	app.server.Close()
}

// Start app
func (app *App) Start() {
	go app.server.Serve()
	defer app.server.Close()
	app.SocketRouter()

	//HTTP handlers
	http.HandleFunc("/", handlerMain) // homepage
	http.HandleFunc("/js/main-bundle", handlerMainJsBundle)
	http.HandleFunc("/js/vendors-bundle", handlerVendorsJsBundle)
	http.HandleFunc("/js/editor.worker.js", handlerEditorWorkerJS)
	http.HandleFunc("/fonts/monaco-font.ttf", handlerMonacoFontTTF)
	http.HandleFunc("/img/thingsdb.gif", handlerThingsdbGIF)
	http.HandleFunc("/img/thingsgui-logo.png", handlerThingsguiLogo)
	http.HandleFunc("/img/thingsdb-logo.png", handlerThingsdbLogo)
	http.HandleFunc("/img/githubLogo.svg", handlerGithubLogo)
	http.HandleFunc("/img/facebookLogo.png", handlerFacebookLogo)
	http.HandleFunc("/img/linkedinLogo.png", handlerLinkedinLogo)
	http.HandleFunc("/img/TTLogo.png", handlerTTLogo)
	http.HandleFunc("/img/view-edit.png", handlerViewEditLogo)
	http.HandleFunc("/favicon.ico", handlerFaviconIco)
	http.HandleFunc("/download", HandlerDownload)
	http.HandleFunc("/session", HandlerSession)

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	http.Handle("/socket.io/", app.server)

	log.Printf("Serving at http://%s:%d/", app.host, app.port)

	if !app.disableOpenBrowser {
		go open(fmt.Sprintf("http://%s:%d/", app.host, app.port))
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%d", app.host, app.port), nil))
}

func main() {
	var err error
	app := App{}

	// init
	app.Init()

	err = app.getEnvVariables()
	if err != nil {
		fmt.Println(err)
	}

	app.client = make(map[string]*Client)
	newSessions()

	options := &engineio.Options{
		PingTimeout: time.Duration(app.timeout+120) * time.Second,
	}
	app.server = socketio.NewServer(options)

	// on interrup clean up
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for sig := range c {
			if sig == os.Interrupt {
				app.quit()
				os.Exit(1)
			}
		}
	}()

	app.Start()
}
