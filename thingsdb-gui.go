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

	handlers "./sockethandlers"
	util "./util"
	engineio "github.com/googollee/go-engine.io"
	socketio "github.com/googollee/go-socket.io"
	things "github.com/thingsdb/go-thingsdb"
)

// AppVersion exposes version information
const AppVersion = "0.0.3-beta"

var connFile = ".thingsgui"

var (
	host               string
	port               uint
	timeout            uint
	disableOpenBrowser bool
)

func Init() {
	flag.StringVar(&host, "host", "0.0.0.0", "Specific host for the http webserver.")
	flag.UintVar(&port, "port", 5000, "Specific port for the http webserver.")
	flag.UintVar(&timeout, "timeout", 0, "Connect and query timeout in seconds")
	flag.BoolVar(&disableOpenBrowser, "disable-open-browser", false, "opens ThingsGUI in your default browser")

	flag.Parse()
}

type App struct {
	host               string
	port               uint16
	server             *socketio.Server
	disableOpenBrowser bool
	timeout            uint16
	client             map[string]*handlers.Client
}

func (app *App) SocketRouter() {
	app.server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")

		app.client[s.ID()] = &handlers.Client{
			Closed:   make(chan bool),
			LogCh:    make(chan string, 1),
			EventCh:  make(chan *things.Event),
			TmpFiles: util.NewTmpFiles(),
			HomePath: util.GetHomePath(connFile),
		}
		app.client[s.ID()].LogCh <- fmt.Sprintf("connected: %s", s.ID())
		return nil
	})

	app.server.OnEvent("/", "connected", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Connected(app.client[s.ID()].Connection)
	})

	app.server.OnEvent("/", "conn", func(s socketio.Conn, data handlers.LoginData) (int, handlers.LoginResp, util.Message) {
		return handlers.Connect(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "reconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Reconnect(app.client[s.ID()])
	})

	app.server.OnEvent("/", "disconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Disconnect(app.client[s.ID()])
	})

	app.server.OnEvent("/", "getConn", func(s socketio.Conn) (int, interface{}, util.Message) {
		return handlers.GetConnection(app.client[s.ID()])
	})

	app.server.OnEvent("/", "newEditConn", func(s socketio.Conn, data handlers.LoginData) (int, interface{}, util.Message) {
		return handlers.NewEditConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "delConn", func(s socketio.Conn, data handlers.LoginData) (int, interface{}, util.Message) {
		return handlers.DelConnection(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "connToo", func(s socketio.Conn, data handlers.LoginData) (int, interface{}, util.Message) {
		return handlers.ConnectionToo(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "log", func(s socketio.Conn) {
		ch := app.client[s.ID()].LogCh
		go func() {
			for p := range ch {
				s.Emit("logging", p)
			}
		}()
	})

	app.server.OnEvent("/", "query", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.Query(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "queryBlob", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.QueryBlob(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "queryEditor", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.QueryEditor(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "cleanupTmp", func(s socketio.Conn) (int, bool, util.Message) {
		return handlers.CleanupTmp(app.client[s.ID()].TmpFiles)
	})

	app.server.OnEvent("/", "watch", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.Watch(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "unwatch", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.Unwatch(app.client[s.ID()], data, app.timeout)
	})

	app.server.OnEvent("/", "getEvent", func(s socketio.Conn) {
		eCh := app.client[s.ID()].EventCh
		lCh := app.client[s.ID()].LogCh
		go func() {
			for p := range eCh {
				_, err := app.client[s.ID()].TmpFiles.ReplaceBinStrWithLink(p.Data)
				if err != nil {
					lCh <- err.Error()
				}
				s.Emit("event", p)
			}
		}()
	})

	app.server.OnError("/", func(e error) {
		fmt.Printf("meet error: %s\n", e.Error())
	})

	app.server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		app.client[s.ID()].LogCh <- fmt.Sprintf("closed: %s", msg)
		app.client[s.ID()].TmpFiles.CleanupTmp()

		handlers.CloseSingleConn(app.client[s.ID()])
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

func (app *App) Start() {
	go app.server.Serve()
	defer app.server.Close()
	app.SocketRouter()

	//HTTP handlers
	http.HandleFunc("/", handlerMain) // homepage
	http.HandleFunc("/js/main-bundle", handlerMainJsBundle)
	http.HandleFunc("/js/vendors-bundle", handlerVendorsJsBundle)
	http.HandleFunc("/js/editor.worker.js", handlerEditorWorkerJS)
	http.HandleFunc("/img/thingsdb.gif", handlerThingsdbGIF)
	http.HandleFunc("/img/thingsdb-logo.png", handlerThingsdbLogo)
	http.HandleFunc("/img/githubLogo.svg", handlerGithubLogo)
	http.HandleFunc("/img/facebookLogo.png", handlerFacebookLogo)
	http.HandleFunc("/img/linkedinLogo.png", handlerLinkedinLogo)
	http.HandleFunc("/img/TTLogo.png", handlerTTLogo)
	http.HandleFunc("/favicon.ico", handlerFaviconIco)
	http.HandleFunc("/download", util.HandlerDownload)

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	http.Handle("/socket.io/", app.server)

	log.Printf("Serving at %s:%d...", app.host, app.port)

	if !app.disableOpenBrowser {
		go open(fmt.Sprintf("http://%s:%d/", app.host, app.port))
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%d", app.host, app.port), nil))
}

func main() {
	var err error
	// init
	Init()
	a := App{}
	a.host = host
	a.port = uint16(port)
	a.timeout = uint16(timeout)
	a.disableOpenBrowser = disableOpenBrowser
	a.client = make(map[string]*handlers.Client)

	options := &engineio.Options{
		PingTimeout: time.Duration(timeout+120) * time.Second,
	}
	a.server, err = socketio.NewServer(options)
	if err != nil {
		fmt.Println(err)
	}

	// on interrup clean up
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for sig := range c {
			if sig == os.Interrupt {
				a.quit()
				os.Exit(1)
			}
		}
	}()

	a.Start()
}
