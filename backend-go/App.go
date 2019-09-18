package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	handlers "./handlers"
	util "./util"
	things "github.com/thingsdb/go/client"
	socketio "github.com/transceptor-technology/go-socket.io"
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

	//insertTimeout uint16

}

func (app *App) logHandler() {
	for {
		msg := <-app.logCh
		println(msg)
	}
}

// func (app *App) SocketRouter() {
// 	app.Server.OnConnect("/", func(s socketio.Conn) error {
// 		s.SetContext("")
// 		fmt.Println("connected:", s.Id())
// 		return nil
// 	})

// 	app.Server.OnEvent("/connected", "/connected", func(s socketio.Conn) (int, interface{}, util.Message) {
// 		fmt.Println("hi")
// 		return handlers.Connected(s.Id(), &app.connections)
// 	})

// 	app.Server.OnEvent("/connect", "connect", func(s socketio.Conn, data map[string]string) (int, interface{}, util.Message) {
// 		return handlers.Connect(s.Id(), app.logCh, &app.connections, data)
// 	})

// 	app.Server.OnEvent("/connect/other", "connectOther", func(s socketio.Conn, data map[string]string) (int, interface{}, util.Message) {
// 		return handlers.ConnectOther(s.Id(), app.logCh, &app.connections, data)
// 	})

// 	app.Server.OnEvent("/disconnect", "disconnect", func(s socketio.Conn) (int, interface{}, util.Message) {
// 		return handlers.Disconnect(app.connections[s.Id()])
// 	})

// 	app.Server.OnError("/", func(e error) {
// 		fmt.Println("meet error:", e)
// 	})

// 	app.Server.OnDisconnect("/", func(s socketio.Conn, msg string) {
// 		fmt.Println("closed:", msg)
// 		handlers.CloseSingleConn(app.connections[s.Id()])
// 	})
// }

func (app *App) SocketRouter() {
	app.Server.On("connection", func(s socketio.Socket) {
		s.On("/connected", func() (int, interface{}, util.Message) {
			fmt.Println("hi")
			return handlers.Connected(s.Id(), &app.connections)
		})
		s.On("/connect", func(data map[string]string) (int, interface{}, util.Message) {
			return handlers.Connect(s.Id(), app.logCh, &app.connections, data)
		})
		s.On("/connect/other", func(data map[string]string) (int, interface{}, util.Message) {
			return handlers.ConnectOther(s.Id(), app.logCh, &app.connections, data)
		})
		s.On("/disconnect", func() (int, interface{}, util.Message) {
			return handlers.Disconnect(app.connections[s.Id()])
		})
	})

	app.Server.On("error", func(s socketio.Socket, err error) {
		app.logCh <- fmt.Sprintf("socket.io error: %s", err.Error())
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

	app.connections = make(map[string]*things.Conn)
	fmt.Println(app.connections)
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
