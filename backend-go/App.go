package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	handlers "./handlers"
	util "./util"
	socketio "github.com/googollee/go-socket.io"
)

// AppVersion exposes version information
const AppVersion = "0.0.1-alpha1"

const retryConnectTime = 5

type App struct {
	onfig       string
	Host        string
	Port        uint16
	logCh       chan string
	Server      *socketio.Server
	debugMode   bool
	configFile  string
	connections map[string]*handlers.Conn

	Timeout uint16
}

func (app *App) logHandler() {
	for {
		msg := <-app.logCh
		println(msg)
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

	app.Server.OnEvent("/", "query", func(s socketio.Conn, data map[string]interface{}) (int, interface{}, util.Message) {
		return handlers.Query(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryEditor", func(s socketio.Conn, data map[string]interface{}) (int, map[string]interface{}, util.Message) {
		return handlers.QueryEditor(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnError("/", func(e error) {
		fmt.Println("meet error:", e)
	})

	app.Server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		fmt.Println("closed:", msg)
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

func (app *App) Start() {
	var err error

	// logchannel
	app.logCh = make(chan string)
	go app.logHandler()

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
	http.HandleFunc("/favicon.ico", handlerFaviconIco)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	http.Handle("/socket.io/", app.Server)

	log.Printf("Serving at %s:%d...", app.Host, app.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", app.Port), nil))
}
