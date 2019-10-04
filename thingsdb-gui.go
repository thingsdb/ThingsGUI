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
	logCh       map[string]chan string
	server      *socketio.Server
	connections map[string]*things.Conn
	openBrowser bool
	timeout     uint16
	tmpFiles    map[string]*util.TmpFiles
}

func (app *App) EventCh(sid string) {
	if app.connections[sid] != nil {
		for e := range app.connections[sid].EventCh {
			fmt.Println("EVENT ", e)
		}
	}
}

func (app *App) SocketRouter() {
	app.server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		// logchannel per client
		app.tmpFiles[s.ID()] = util.NewTmpFiles()
		app.logCh[s.ID()] = make(chan string, 1)
		app.logCh[s.ID()] <- fmt.Sprintf("connected: %s", s.ID())
		fmt.Println(app.connections[s.ID()])
		go app.EventCh(s.ID())
		return nil
	})

	app.server.OnEvent("/", "connected", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Connected(app.connections[s.ID()])
	})

	app.server.OnEvent("/", "conn", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.Connect(s.ID(), app.connections, app.logCh, data)
	})

	app.server.OnEvent("/", "disconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Disconnect(app.connections[s.ID()])
	})

	app.server.OnEvent("/", "log", func(s socketio.Conn, data string) {
		ch := app.logCh[s.ID()]
		go func() {
			for p := range ch {
				fmt.Println(p)
				s.Emit("logging", p)
			}
		}()
	})

	app.server.OnEvent("/", "query", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.Query(app.connections[s.ID()], data, app.timeout, app.tmpFiles[s.ID()])
	})

	app.server.OnEvent("/", "queryBlob", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.QueryBlob(app.connections[s.ID()], data, app.timeout, app.tmpFiles[s.ID()])
	})

	app.server.OnEvent("/", "queryEditor", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.QueryEditor(app.connections[s.ID()], data, app.timeout, app.tmpFiles[s.ID()])
	})

	app.server.OnEvent("/", "cleanupTmp", func(s socketio.Conn) (int, bool, util.Message) {
		return handlers.CleanupTmp(app.tmpFiles[s.ID()])
	})

	app.server.OnError("/", func(e error) {
		for _, v := range app.logCh {
			v <- fmt.Sprintf("meet error: %s", e.Error())
		}
		fmt.Printf("meet error: %s\n", e.Error())
	})

	app.server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		app.logCh[s.ID()] <- fmt.Sprintf("closed: %s", msg)
		app.tmpFiles[s.ID()].CleanupTmp()
		handlers.CloseSingleConn(app.connections[s.ID()])
		if app.logCh[s.ID()] != nil {
			// close(app.logCh[s.ID()]) // Is it aproblem if not close first???
			delete(app.logCh, s.ID())
		}
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
	fmt.Println("QUIT")
	for _, v := range app.connections {
		if v != nil {
			v.Close()
		}
	}
	for _, v := range app.tmpFiles {
		if v != nil {
			v.CleanupTmp()
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
	a.logCh = make(map[string]chan string)
	a.connections = make(map[string]*things.Conn)
	a.tmpFiles = make(map[string]*util.TmpFiles)
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
