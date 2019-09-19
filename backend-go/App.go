package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	handlers "./handlers"
	util "./util"
	socketio "github.com/googollee/go-socket.io"
	things "github.com/thingsdb/go/client"
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
	connections map[string]*things.Conn

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
		return nil
	})

	app.Server.OnEvent("/", "connected", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Connected(s.ID(), &app.connections)
	})

	app.Server.OnEvent("/", "conn", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.Connect(s.ID(), app.logCh, &app.connections, data)
	})

	app.Server.OnEvent("/", "connToOther", func(s socketio.Conn, data map[string]string) (int, handlers.LoginResp, util.Message) {
		return handlers.ConnectOther(s.ID(), app.logCh, &app.connections, data)
	})

	app.Server.OnEvent("/", "disconn", func(s socketio.Conn) (int, handlers.LoginResp, util.Message) {
		return handlers.Disconnect(app.connections[s.ID()])
	})

	app.Server.OnEvent("/", "getInfo", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetDbinfo(s.ID(), &app.connections, app.Timeout)
	})

	app.Server.OnEvent("/", "getCollections", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetCollections(s.ID(), &app.connections, app.Timeout)
	})

	app.Server.OnEvent("/", "getCollection", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetCollection(s.ID(), &app.connections, app.Timeout)
	})

	app.Server.OnEvent("/", "newCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.NewCollection(s.ID(), &app.connections, data, app.Timeout)
	})

	app.Server.OnEvent("/", "delCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.DelCollection(s.ID(), &app.connections, data, app.Timeout)
	})

	app.Server.OnEvent("/", "renameCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.RenameCollection(s.ID(), &app.connections, data, app.Timeout)
	})

	app.Server.OnEvent("/", "setQuota", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.SetQuota(s.ID(), &app.connections, data, app.Timeout)
	})

	app.Server.OnError("/", func(e error) {
		fmt.Println("meet error:", e)
	})

	app.Server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		fmt.Println("closed:", msg)
		handlers.CloseSingleConn(app.connections[s.ID()])
	})
}

func (app *App) quit(err error) {
	rc := 0
	if err != nil {
		fmt.Printf("%s\n", err)
		rc = 1
	}
	handlers.CloseAllConn(&app.connections)
	os.Exit(rc)
}

func (app *App) Start() {
	var err error

	//logchannel
	app.logCh = make(chan string)
	go app.logHandler()

	// socketio
	app.Server, err = socketio.NewServer(nil)
	if err != nil {
		app.quit(err)
	}

	go app.Server.Serve()
	defer app.Server.Close()

	app.connections = make(map[string]*things.Conn)
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
