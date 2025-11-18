package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	socketio "github.com/doquangtan/socketio/v4"
)

var connFile = ".config/ThingsGUI/thingsgui.connections"
var sessionFile = ".config/ThingsGUI/thingsgui.session"

// app type
type app struct {
	clients map[string]*client
	server  *socketio.Io
}

// authResp type
type authResp struct {
	AuthMethod string
	AuthOnly   bool
}

// SocketRouter socketio
func (app *app) socketRouter() {
	app.server.OnConnection(func(s *socketio.Socket) {
		app.clients[s.Id] = &client{
			connectionsPath: getHomePath(connFile),
			logCh:           make(chan string),
			roomStore:       newRoomStore(),
			sessionPath:     getHomePath(sessionFile),
			socketConn:      s,
			tmpFiles:        newTmpFiles(),
		}

		lCh := app.clients[s.Id].logCh
		go func() {
			for p := range lCh {
				s.Emit("onLogging", p)
			}
		}()

		lCh <- fmt.Sprintf("connected: %s", s.Id)

		s.On("authKey", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data map[string]string
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].authKey(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("authOnly", func(e *socketio.EventPayload) {
			message := successMsg()
			var auth authResp
			if thingsguiAddress != "" {
				auth.AuthOnly = true
				auth.AuthMethod = thingsguiAuthMethod
			}
			e.Ack(message.Status, auth, message)
		})

		s.On("authToken", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data map[string]string
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].authToken(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("authPass", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data map[string]string
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].authPass(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("connected", func(e *socketio.EventPayload) {
			status, resp, message := app.clients[s.Id].connected()
			e.Ack(status, resp, message)
		})

		s.On("connToNew", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data loginData
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].connectToNew(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("connViaCache", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data loginData
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].handlerConnectViaCache(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("reconn", func(e *socketio.EventPayload) {
			status, resp, message := app.clients[s.Id].reconnect()
			e.Ack(status, resp, message)
		})

		s.On("disconn", func(e *socketio.EventPayload) {
			status, resp, message := app.clients[s.Id].disconnect()
			e.Ack(status, resp, message)
		})

		s.On("getCachedConn", func(e *socketio.EventPayload) {
			status, resp, message := app.clients[s.Id].getCachedConnections()
			e.Ack(status, resp, message)
		})

		s.On("newCachedConn", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(lData)
				if ok {
					status, resp, message := app.clients[s.Id].newCachedConnection(data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("editCachedConn", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(lData)
				if ok {
					status, resp, message := app.clients[s.Id].editCachedConnection(data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("renameCachedConn", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(lData)
				if ok {
					status, resp, message := app.clients[s.Id].renameCachedConnection(data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("delCachedConn", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data loginData
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].delCachedConnection(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("query", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				// TODO
				var data dataReq
				rbytes, _ := json.Marshal(e.Data[0])
				json.Unmarshal(rbytes, &data)

				status, resp, message := app.clients[s.Id].query(data)
				e.Ack(status, resp, message)
			}
		})

		s.On("cleanupTmp", func(e *socketio.EventPayload) {
			resp := true
			err := app.clients[s.Id].tmpFiles.cleanupTmp()
			message := msg(err)
			if err != nil {
				resp = false
			}
			e.Ack(message.Status, resp, message)
		})

		s.On("join", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(dataReq)
				if ok {
					status, resp, message := app.clients[s.Id].join(s, data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("leave", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(dataReq)
				if ok {
					status, resp, message := app.clients[s.Id].leave(data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("run", func(e *socketio.EventPayload) {
			if len(e.Data) > 0 {
				data, ok := e.Data[0].(dataReq)
				if ok {
					status, resp, message := app.clients[s.Id].run(data)
					e.Ack(status, resp, message)
				}
			}
		})

		s.On("error", func(e *socketio.EventPayload) {
			fmt.Printf("meet error: %s\n", e.Data[0])
		})

		s.On("disconnect", func(e *socketio.EventPayload) {
			app.clients[s.Id].logCh <- fmt.Sprintf("closed: %s", s.Id)
			app.clients[s.Id].tmpFiles.cleanupTmp()

			app.clients[s.Id].closeSingleConn()
			delete(app.clients, s.Id)
		})
	})
}

// Start app
func (app *app) start() {
	// app.server is started by now

	//SocketIO handlers
	app.socketRouter()

	defer app.server.Close()

	//HTTP handlers
	http.HandleFunc("/", handlerMain) // homepage
	http.HandleFunc("/js/main-bundle", handlerMainJsBundle)
	http.HandleFunc("/js/vendors-bundle", handlerVendorsJsBundle)
	http.HandleFunc("/js/editor.worker.js", handlerEditorWorkerJS)
	http.HandleFunc("/fonts/monaco-font.ttf", handlerMonacoFontTTF)
	http.HandleFunc("/img/thingsdb.gif", handlerThingsdbGIF)
	http.HandleFunc("/img/thingsgui-logo.png", handlerThingsguiLogo)
	http.HandleFunc("/img/thingsdb-logo.png", handlerThingsdbLogo)
	http.HandleFunc("/img/CesbitLogo.png", handlerCesbitLogo)
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
