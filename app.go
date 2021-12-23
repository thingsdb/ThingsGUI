package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

var connFile = ".config/ThingsGUI/thingsgui.connections"
var sessionFile = ".config/ThingsGUI/thingsgui.session"

// app type
type app struct {
	clients map[string]*client
	server  *socketio.Server
}

// authResp type
type authResp struct {
	AuthMethod string
	AuthOnly   bool
}

// SocketRouter socketio
func (app *app) socketRouter() {
	app.server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		app.clients[s.ID()] = &client{
			connectionsPath: getHomePath(connFile),
			logCh:           make(chan string),
			roomStore:       newRoomStore(),
			sessionPath:     getHomePath(sessionFile),
			socketConn:      &s,
			tmpFiles:        newTmpFiles(),
		}

		lCh := app.clients[s.ID()].logCh
		go func() {
			for p := range lCh {
				s.Emit("onLogging", p)
			}
		}()

		lCh <- fmt.Sprintf("connected: %s", s.ID())
		return nil
	})

	app.server.OnEvent("/", "authKey", func(s socketio.Conn, data map[string]string) (int, interface{}, message) {
		return app.clients[s.ID()].authKey(data)
	})

	app.server.OnEvent("/", "authOnly", func(s socketio.Conn) (int, authResp, message) {
		message := successMsg()
		var auth authResp
		if thingsguiAddress != "" {
			auth.AuthOnly = true
			auth.AuthMethod = thingsguiAuthMethod
		}
		return message.Status, auth, message
	})

	app.server.OnEvent("/", "authToken", func(s socketio.Conn, data map[string]string) (int, interface{}, message) {
		return app.clients[s.ID()].authToken(data)
	})

	app.server.OnEvent("/", "authPass", func(s socketio.Conn, data map[string]string) (int, interface{}, message) {
		return app.clients[s.ID()].authPass(data)
	})

	app.server.OnEvent("/", "cookie", func(s socketio.Conn, cookies string) int {
		client := app.clients[s.ID()]
		if useCookieSession && client.cookie == nil {
			header := s.RemoteHeader()
			header.Set("Cookie", cookies)
			req := http.Request{Header: header}
			cookie, _ := req.Cookie(cookieName)
			client.cookie = cookie
		}
		return http.StatusNoContent
	})

	app.server.OnEvent("/", "connected", func(s socketio.Conn) (int, connResp, message) {
		client := app.clients[s.ID()]
		if client.cookie == nil {
			req := http.Request{Header: s.RemoteHeader()}
			cookie, _ := req.Cookie(cookieName)
			client.cookie = cookie
		}
		return client.connected()
	})

	app.server.OnEvent("/", "connToNew", func(s socketio.Conn, data loginData) (int, connResp, message) {
		return app.clients[s.ID()].connectToNew(data)
	})

	app.server.OnEvent("/", "connViaCache", func(s socketio.Conn, data loginData) (int, connResp, message) {
		return app.clients[s.ID()].handlerConnectViaCache(data)
	})

	app.server.OnEvent("/", "reconn", func(s socketio.Conn) (int, connResp, message) {
		return app.clients[s.ID()].reconnect()
	})

	app.server.OnEvent("/", "disconn", func(s socketio.Conn) (int, connResp, message) {
		return app.clients[s.ID()].disconnect()
	})

	app.server.OnEvent("/", "getCachedConn", func(s socketio.Conn) (int, interface{}, message) {
		return app.clients[s.ID()].getCachedConnections()
	})

	app.server.OnEvent("/", "newCachedConn", func(s socketio.Conn, data lData) (int, interface{}, message) {
		return app.clients[s.ID()].newCachedConnection(data)
	})

	app.server.OnEvent("/", "editCachedConn", func(s socketio.Conn, data lData) (int, interface{}, message) {
		return app.clients[s.ID()].editCachedConnection(data)
	})

	app.server.OnEvent("/", "renameCachedConn", func(s socketio.Conn, data lData) (int, interface{}, message) {
		return app.clients[s.ID()].renameCachedConnection(data)
	})

	app.server.OnEvent("/", "delCachedConn", func(s socketio.Conn, data loginData) (int, interface{}, message) {
		return app.clients[s.ID()].delCachedConnection(data)
	})

	app.server.OnEvent("/", "query", func(s socketio.Conn, data dataReq) (int, interface{}, message) {
		return app.clients[s.ID()].query(data)
	})

	app.server.OnEvent("/", "cleanupTmp", func(s socketio.Conn) (int, bool, message) {
		resp := true
		err := app.clients[s.ID()].tmpFiles.cleanupTmp()
		message := msg(err)
		if err != nil {
			resp = false
		}
		return message.Status, resp, message
	})

	app.server.OnEvent("/", "join", func(s socketio.Conn, data dataReq) (int, interface{}, message) {
		return app.clients[s.ID()].join(s, data)
	})

	app.server.OnEvent("/", "leave", func(s socketio.Conn, data dataReq) (int, interface{}, message) {
		return app.clients[s.ID()].leave(data)
	})

	app.server.OnEvent("/", "run", func(s socketio.Conn, data dataReq) (int, interface{}, message) {
		return app.clients[s.ID()].run(data)
	})

	app.server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Printf("meet error: %s\n", e.Error())
	})

	app.server.OnDisconnect("/", func(s socketio.Conn, msg string) {
		app.clients[s.ID()].logCh <- fmt.Sprintf("closed: %s", msg)
		app.clients[s.ID()].tmpFiles.cleanupTmp()

		app.clients[s.ID()].closeSingleConn()
		delete(app.clients, s.ID())
	})
}

// Start app
func (app *app) start() {
	go app.server.Serve()
	defer app.server.Close()
	app.socketRouter()

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
	http.HandleFunc("/download", handlerDownload)
	http.HandleFunc("/session", handlerSession)

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./react/static/"))))

	http.Handle("/socket.io/", app.server)

	log.Printf("Serving at http://%s:%d/", serverHost, serverPort)

	if !disableOpenBrowser {
		go open(fmt.Sprintf("http://%s:%d/", serverHost, serverPort))
	}
	log.Fatal(http.ListenAndServe(fmt.Sprintf("%s:%d", serverHost, serverPort), nil))
}

func (app *app) quit() {
	for _, v := range app.clients {
		if v != nil {
			v.tmpFiles.cleanupTmp()
			if v.connection != nil {
				v.connection.Close()
			}
		}
	}
	app.server.Close()
}
