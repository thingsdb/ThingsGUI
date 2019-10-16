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

	handlers "./sockethandlers"
	util "./util"
	socketio "github.com/googollee/go-socket.io"
	things "github.com/thingsdb/go/client"
)

// AppVersion exposes version information
const AppVersion = "0.0.1-alpha1"

const retryConnectTime = 5

var (
	host        string
	port        uint
	timeout     uint
	openBrowser bool
)

func Init() {
	flag.StringVar(&host, "host", "localhost", "host")
	flag.UintVar(&port, "port", 8080, "port")
	flag.UintVar(&timeout, "timeout", 30, "timeout")
	flag.BoolVar(&openBrowser, "open", true, "opens a page in your default browser")

	flag.Parse()
}

type App struct {
	host        string
	port        uint16
	server      *socketio.Server
	openBrowser bool
	timeout     uint16
	client      map[string]*handlers.Client
}

func (app *App) SocketRouter() {
	app.server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")

		app.client[s.ID()] = &handlers.Client{
			Closed:   make(chan bool),
			EventCh:  make(chan *things.Event),
			LogCh:    make(chan string, 1),
			TmpFiles: util.NewTmpFiles(),
		}
		app.client[s.ID()].LogCh <- fmt.Sprintf("connected: %s", s.ID())
		return nil
	})

	app.server.OnEvent("/", "connected", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Connected(app.client[s.ID()].Connection)
	})

	app.server.OnEvent("/", "conn", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.Connect(app.client[s.ID()], data)
	})

	app.server.OnEvent("/", "disconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Disconnect(app.client[s.ID()])
	})

	app.server.OnEvent("/", "log", func(s socketio.Conn, data string) {
		ch := app.client[s.ID()].LogCh
		go func() {
			for p := range ch {
				fmt.Println(p)
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

	app.server.OnEvent("/", "getEvent", func(s socketio.Conn, data string) {
		eCh := app.client[s.ID()].EventCh
		lCh := app.client[s.ID()].LogCh
		go func() {
			for p := range eCh {
				fmt.Println(p)
				err := app.client[s.ID()].TmpFiles.ReplaceBinStrWithLink(p.Data)
				if err != nil {
					lCh <- err.Error()
				}
				s.Emit("event", p)
			}
		}()
	})

	app.server.OnError("/", func(e error) {
		// for _, v := range app.client {
		// 	v.LogCh <- fmt.Sprintf("meet error: %s", e.Error())
		// }
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
		fmt.Println("QUIT2", v)
		if v != nil {
			v.TmpFiles.CleanupTmp()
			if v.Connection != nil {
				v.Connection.Close()
			}
		}
	}
}

func (app *App) Start() {
	go app.server.Serve()
	defer app.server.Close()
	app.SocketRouter()

	//HTTP handlers
	http.HandleFunc("/", handlerMain) // homepage
	http.HandleFunc("/js/main-bundle", handlerMainJsBundle)
	http.HandleFunc("/js/vendors-bundle", handlerVendorsJsBundle)
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

	if app.openBrowser {
		go open("http://localhost:8080/")
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", app.port), nil))
}

func main() {
	var err error
	// init
	Init()
	a := App{}
	a.host = host
	a.port = uint16(port)
	a.timeout = uint16(timeout)
	a.openBrowser = openBrowser
	a.client = make(map[string]*handlers.Client)
	a.server, err = socketio.NewServer(nil)
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
