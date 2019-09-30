package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	handlers "./sockethandlers"
	util "./util"
	socketio "github.com/googollee/go-socket.io"
)

// AppVersion exposes version information
const AppVersion = "0.0.1-alpha1"

const retryConnectTime = 5

var (
	host        string
	port        uint
	timeout     uint
	openBrowser bool
	//debugMode  bool
	//configFile string
)

func Init() {
	fmt.Println("hi")
	flag.StringVar(&host, "host", "localhost", "host")
	flag.UintVar(&port, "port", 8080, "Port")
	flag.UintVar(&timeout, "timeout", 30, "timeout")
	flag.BoolVar(&openBrowser, "open", true, "opens a page in your default browser")
	//flag.BoolVar(&debugMode, "debug mode", false, "Debug ")
	//flag.StringVar(&configFile, "config file", "default.conf", "Config file")

	flag.Parse()
}

type App struct {
	config      string
	Host        string
	Port        uint16
	logCh       chan string
	Server      *socketio.Server
	debugMode   bool
	configFile  string
	connections map[string]*handlers.Conn
	OpenBrowser bool
	Timeout     uint16
}

func (app *App) logHandler() {
	for {
		msg := <-app.logCh
		fmt.Println(msg)
	}
}

func (app *App) SocketRouter() {
	app.Server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		app.connections[s.ID()] = &handlers.Conn{}
		return nil
	})

	app.Server.OnEvent("/", "connected", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Connected(app.connections[s.ID()].Connection)
	})

	app.Server.OnEvent("/", "conn", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.Connect(app.connections[s.ID()], app.logCh, data)
	})

	app.Server.OnEvent("/", "connToOther", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.ConnectOther(app.connections[s.ID()], app.logCh, data)
	})

	app.Server.OnEvent("/", "disconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Disconnect(app.connections[s.ID()].Connection)
	})

	app.Server.OnEvent("/", "query", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.Query(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryBlob", func(s socketio.Conn, data handlers.Data) (int, interface{}, util.Message) {
		return handlers.QueryBlob(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryEditor", func(s socketio.Conn, data handlers.Data) (int, map[string]interface{}, util.Message) {
		return handlers.QueryEditor(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "cleanupTmp", func(s socketio.Conn) (int, bool, util.Message) {
		return handlers.CleanupTmp()
	})

	app.Server.OnError("/", func(e error) {
		fmt.Println("meet error:", e)
	})

	app.Server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		fmt.Println("closed:", msg)
		util.CleanupTmp()
		handlers.CloseSingleConn(app.connections[s.ID()].Connection)
		delete(app.connections, s.ID())

	})
}

func (app *App) quit(err error) {
	fmt.Println("QUIT")
	rc := 0
	if err != nil {
		fmt.Printf("%s\n", err)
		rc = 1
	}
	os.Exit(rc)
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

func (app *App) Start() {
	var err error

	// logchannel
	app.logCh = make(chan string)
	go app.logHandler()

	// for unique numbering
	util.Init(app.logCh)

	// socketio
	app.Server, err = socketio.NewServer(nil)
	if err != nil {
		app.quit(err)
	}

	go app.Server.Serve()
	defer app.Server.Close()

	app.connections = make(map[string]*handlers.Conn)
	app.SocketRouter()

	//HTTP handlers
	http.HandleFunc("/", handlerMain) // homepage
	http.HandleFunc("/js/main-bundle", handlerMainJsBundle)
	http.HandleFunc("/js/vendors-bundle", handlerVendorsJsBundle)
	http.HandleFunc("/img/thingsdb.gif", handlerThingsdbGIF)
	http.HandleFunc("/favicon.ico", handlerFaviconIco)
	http.HandleFunc("/download", util.HandlerDownload)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	http.Handle("/socket.io/", app.Server)

	log.Printf("Serving at %s:%d...", app.Host, app.Port)

	if app.OpenBrowser {
		go open("http://localhost:8080/")
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", app.Port), nil))
}

func main() {
	Init()
	a := App{}
	a.Host = host
	a.Port = uint16(port)
	a.Timeout = uint16(timeout)
	fmt.Println(openBrowser)
	a.OpenBrowser = openBrowser
	a.Start()
}
