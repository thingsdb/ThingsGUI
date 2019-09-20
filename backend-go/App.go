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

	app.Server.OnEvent("/", "getInfo", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		fmt.Println("getInfo", app.connections)
		return handlers.GetDbinfo(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "getCollections", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetCollections(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "getCollection", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetCollection(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "newCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.NewCollection(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "delCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.DelCollection(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "renameCollection", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.RenameCollection(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "setQuota", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.SetQuota(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "getUsers", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetUsers(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "getUser", func(s socketio.Conn) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.GetUser(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "newUser", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.NewUser(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "delUser", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.DelUser(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "renameUser", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.RenameUser(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "setPassword", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.SetPassword(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "resetPassword", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.ResetPassword(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "grant", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.Grant(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "revoke", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.Revoke(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "newToken", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.NewToken(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "delToken", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.DelToken(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "delExpired", func(s socketio.Conn, data map[string]interface{}) (int, handlers.ThingsdbResp, util.Message) {
		return handlers.DelExpired(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "getNodes", func(s socketio.Conn) (int, handlers.NodeResp, util.Message) {
		return handlers.GetNodes(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "getNode", func(s socketio.Conn) (int, handlers.NodeResp, util.Message) {
		return handlers.GetNode(app.connections[s.ID()].Connection, app.Timeout)
	})

	app.Server.OnEvent("/", "resetCounters", func(s socketio.Conn, data map[string]interface{}) (int, handlers.NodeResp, util.Message) {
		return handlers.ResetCounters(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "setLoglevel", func(s socketio.Conn, data map[string]interface{}) (int, handlers.NodeResp, util.Message) {
		return handlers.SetLoglevel(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "shutdown", func(s socketio.Conn, data map[string]interface{}) (int, handlers.NodeResp, util.Message) {
		return handlers.Shutdown(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "popNode", func(s socketio.Conn, data map[string]interface{}) (int, handlers.NodeResp, util.Message) {
		return handlers.PopNode(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "replaceNode", func(s socketio.Conn, data map[string]interface{}) (int, handlers.NodeResp, util.Message) {
		return handlers.ReplaceNode(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryThing", func(s socketio.Conn, data map[string]interface{}) (int, handlers.CollectionResp, util.Message) {
		return handlers.QueryThing(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryRaw", func(s socketio.Conn, data map[string]interface{}) (int, handlers.CollectionResp, util.Message) {
		return handlers.QueryRaw(app.connections[s.ID()].Connection, data, app.Timeout)
	})

	app.Server.OnEvent("/", "queryEditor", func(s socketio.Conn, data map[string]interface{}) (int, handlers.CollectionResp, util.Message) {
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
