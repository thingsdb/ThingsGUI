package main

import (
	"flag"
	"fmt"
	"net/http"

	handlers "./handlers"
	things "github.com/thingsdb/go/client"
	socketio "github.com/googollee/go-socket.io"
)

// AppVersion exposes version information
const AppVersion = "0.0.0-beta"

const retryConnectTime = 5

// // Conn is used to store the user/password with the connection.
// type Conn struct {
// 	user     string
// 	password string
// 	connection   *things.Conn
// }




type App struct {
	config  string
	host 	string
	port    uint16
	logCh   chan string
	server  *socketio.Server
	connections     map[string]*things.Conn

	//debugMode     string
	//insertTimeout uint16
	//version string
}

var base = App{}

// type handler interface {
// 	// BaseHandler
// 	SetupBase(so *socketio.Socket, connections *things.Conn)
// }

func init() {
	flag.StringVar(&host, "host", "localhost", "host")
	flag.uint16Var(&port, "port", 8080, "Port")
	flag.BoolVar(&debug, "debug mode", false, "Debug ")
	flag.StringVar(&configFile, "config file", "default.conf", "Config file")

	flag.Parse()
}

func logHandler(logCh chan string) {
	for {
		msg := <-logCh
		if *xVerbose {
			println(msg)
		}
	}
}


func (server *socketio.Server) SocketRouter() {
	server.On("/connected", func(s socketio.Conn) (interface{}, Message) {
		return handlers.Connected(&base.client)
	})

	server.On("/connect", func(s socketio.Conn, data map[string]interface{}) (interface{}, Message) {
        return handlers.Connected(&base.client, data)
	})

	server.On("/connect/other", func(s socketio.Conn, data map[string]interface{}) (interface{}, Message) {
        return handlers.Connected(&base.client, data)
	})





	// -----
	server.On("/disconnect", func(_ string) (int, interface{}) {
		return LoginHandler.disconnect()
	})

	server.On("/thingsdb/get_info", func(_ string) (int, interface{}) {
		return ThingsDBHandler.get_dbinfo()
	})

	server.On("/thingsdb/get_collections", func(_ string) (int, interface{}) {
		return ThingsDBHandler.get_collections()
	})

	server.On("/thingsdb/get_collection", func(_ string) (int, interface{}) {
		return ThingsDBHandler.get_collection()
	})

	server.On("/thingsdb/add", func(_ string) (int, interface{}) {
		return ThingsDBHandler.new_collection()
	})

	server.On("/thingsdb/remove", func(_ string) (int, interface{}) {
		return ThingsDBHandler.del_collection()
	})

	server.On("/thingsdb/rename", func(_ string) (int, interface{}) {
		return ThingsDBHandler.rename_collection()
	})

	server.On("/thingsdb/set_quota", func(_ string) (int, interface{}) {
		return ThingsDBHandler.set_quota()
	})

	server.On("/collection/query", func(_ string) (int, interface{}) {
		return CollectionHandler.query_thing()
	})

	server.On("/collection/raw_query", func(_ string) (int, interface{}) {
		return CollectionHandler.raw_query()
	})

	server.On("/collection/query_with_output", func(_ string) (int, interface{}) {
		return CollectionHandler.query_with_output()
	})

	server.On("/collection/query_editor", func(_ string) (int, interface{}) {
		return CollectionHandler.query_editor()
	})

	server.On("/user/get_users", func(_ string) (int, interface{}) {
		return UserHandler.get_users()
	})

	server.On("/user/get", func(_ string) (int, interface{}) {
		return UserHandler.get_user()
	})

	server.On("/user/add", func(_ string) (int, interface{}) {
		return UserHandler.new_user()
	})

	server.On("/user/remove", func(_ string) (int, interface{}) {
		return UserHandler.del_user()
	})

	server.On("/user/rename", func(_ string) (int, interface{}) {
		return UserHandler.rename_user()
	})

	server.On("/user/password", func(_ string) (int, interface{}) {
		return UserHandler.set_password()
	})

	server.On("/user/reset_password", func(_ string) (int, interface{}) {
		return UserHandler.reset_password()
	})

	server.On("/user/grant", func(_ string) (int, interface{}) {
		return UserHandler.grant()
	})

	server.On("/user/revoke", func(_ string) (int, interface{}) {
		return UserHandler.revoke()
	})

	server.On("/user/new_token", func(_ string) (int, interface{}) {
		return UserHandler.new_token()
	})

	server.On("/user/del_token", func(_ string) (int, interface{}) {
		return UserHandler.del_token()
	})

	server.On("/user/del_expired", func(_ string) (int, interface{}) {
		return UserHandler.del_expired()
	})

	server.On("/node/get_nodes", func(_ string) (int, interface{}) {
		return NodeHandler.get_nodes()
	})

	server.On("/node/get", func(_ string) (int, interface{}) {
		return NodeHandler.get_node()
	})

	server.On("/node/loglevel", func(_ string) (int, interface{}) {
		return NodeHandler.set_loglevel()
	})

	server.On("/node/counters/reset", func(_ string) (int, interface{}) {
		return NodeHandler.reset_counters()
	})

	server.On("/node/shutdown", func(_ string) (int, interface{}) {
		return NodeHandler.shutdown()
	})

	server.On("/node/add", func(_ string) (int, interface{}) {
		return NodeHandler.new_node()
	})

	server.On("/node/pop", func(_ string) (int, interface{}) {
		return NodeHandler.pop_node()
	})

	server.On("/node/replace", func(_ string) (int, interface{}) {
		return NodeHandler.replace_node()
	})

	server.OnError("error", func(so socketio.Socket, err error) {
		base.logCh <- fmt.Sprintf("socket.io error: %s", err.Error())
	})
}

func SetupBase(so *socketio.Socket, conn []Conn) {

    so.OnConnect("connect", func(s socketio.Conn) error {
        s.SetContext("")
        sid :=  s.ID()
        fmt.Println("connected:", sid)

        conn := things.NewConn(
            base.host,
            base.port,
        )
        base.connections[sid] = conn

		return http.StatusOK
	})

	so.OnDisconnect("disconnect", func(s socketio.Conn, msg string) {
        fmt.Println("closed", msg)
        conn = base.connections[s.ID()]
        if conn {
			conn.Close()
			delete(base.connections, s.ID())
        }
	})
}

func quit(err error) {
	rc := 0
	if err != nil {
		fmt.Printf("%s\n", err)
		rc = 1
	}

	for _, conn := range base.connections {
        if conn != nil {
			conn.Close()
			delete(base.connections, s.ID())
        }
	}

	os.Exit(rc)
}

func main() {

	//logchannel
	base.logCh = make(chan string)
	go logHandler(base.logCh)

	// socketio
	base.server, err := socketio.NewServer(nil)
	if err != nil {
		quit(err)
	}

	handlers.SetupBase(&base.server, &conn)

	SocketRouter(&base.server)


	go base.server.Serve()
	defer base.server.Close()


	http.Handle("/socket.io/", base.server)
	// http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.Printf("Serving at localhost:%d...", base.port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", base.port), nil))



}

