package main

import (
	"flag"
	"fmt"
	"net/http"

	things "github.com/thingsdb/ThingsDB/tree/master/connectors/go"
	socketio "github.com/transceptor-technology/go-socket.io"
)

// AppVersion exposes version information
const AppVersion = "0.0.0-beta"

const retryConnectTime = 5

type App struct {
	config  string
	port    uint16
	clients map[string]*things.Client
	logCh   chan string
	server  *socketio.Server

	//debugMode     string
	//insertTimeout uint16
	//version string
}

var base = App{}

type handler interface {
	// BaseHandler
	SetupBase(so *socketio.Socket, clients map[string]*things.Client)
}

func init() {
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

func SocketRouter(server *socketio.Server) {
	server.On("connection", func(so socketio.Socket) {
		so.On("/connected", func(_ string) (int, interface{}) {
			return LoginHandler.connected()
		})

		so.On("/connect", func(_ string) (int, interface{}) {
			return LoginHandler.connect()
		})

		so.On("/connect/other", func(_ string) (int, interface{}) {
			return LoginHandler.connect_other()
		})

		so.On("/disconnect", func(_ string) (int, interface{}) {
			return LoginHandler.disconnect()
		})

		so.On("/thingsdb/get_info", func(_ string) (int, interface{}) {
			return ThingsDBHandler.get_dbinfo()
		})

		so.On("/thingsdb/get_collections", func(_ string) (int, interface{}) {
			return ThingsDBHandler.get_collections()
		})

		so.On("/thingsdb/get_collection", func(_ string) (int, interface{}) {
			return ThingsDBHandler.get_collection()
		})

		so.On("/thingsdb/add", func(_ string) (int, interface{}) {
			return ThingsDBHandler.new_collection()
		})

		so.On("/thingsdb/remove", func(_ string) (int, interface{}) {
			return ThingsDBHandler.del_collection()
		})

		so.On("/thingsdb/rename", func(_ string) (int, interface{}) {
			return ThingsDBHandler.rename_collection()
		})

		so.On("/thingsdb/set_quota", func(_ string) (int, interface{}) {
			return ThingsDBHandler.set_quota()
		})

		so.On("/collection/query", func(_ string) (int, interface{}) {
			return CollectionHandler.query_thing()
		})

		so.On("/collection/raw_query", func(_ string) (int, interface{}) {
			return CollectionHandler.raw_query()
		})

		so.On("/collection/query_with_output", func(_ string) (int, interface{}) {
			return CollectionHandler.query_with_output()
		})

		so.On("/collection/query_editor", func(_ string) (int, interface{}) {
			return CollectionHandler.query_editor()
		})

		so.On("/user/get_users", func(_ string) (int, interface{}) {
			return UserHandler.get_users()
		})

		so.On("/user/get", func(_ string) (int, interface{}) {
			return UserHandler.get_user()
		})

		so.On("/user/add", func(_ string) (int, interface{}) {
			return UserHandler.new_user()
		})

		so.On("/user/remove", func(_ string) (int, interface{}) {
			return UserHandler.del_user()
		})

		so.On("/user/rename", func(_ string) (int, interface{}) {
			return UserHandler.rename_user()
		})

		so.On("/user/password", func(_ string) (int, interface{}) {
			return UserHandler.set_password()
		})

		so.On("/user/reset_password", func(_ string) (int, interface{}) {
			return UserHandler.reset_password()
		})

		so.On("/user/grant", func(_ string) (int, interface{}) {
			return UserHandler.grant()
		})

		so.On("/user/revoke", func(_ string) (int, interface{}) {
			return UserHandler.revoke()
		})

		so.On("/user/new_token", func(_ string) (int, interface{}) {
			return UserHandler.new_token()
		})

		so.On("/user/del_token", func(_ string) (int, interface{}) {
			return UserHandler.del_token()
		})

		so.On("/user/del_expired", func(_ string) (int, interface{}) {
			return UserHandler.del_expired()
		})

		so.On("/node/get_nodes", func(_ string) (int, interface{}) {
			return NodeHandler.get_nodes()
		})

		so.On("/node/get", func(_ string) (int, interface{}) {
			return NodeHandler.get_node()
		})

		so.On("/node/loglevel", func(_ string) (int, interface{}) {
			return NodeHandler.set_loglevel()
		})

		so.On("/node/counters/reset", func(_ string) (int, interface{}) {
			return NodeHandler.reset_counters()
		})

		so.On("/node/shutdown", func(_ string) (int, interface{}) {
			return NodeHandler.shutdown()
		})

		so.On("/node/add", func(_ string) (int, interface{}) {
			return NodeHandler.new_node()
		})

		so.On("/node/pop", func(_ string) (int, interface{}) {
			return NodeHandler.pop_node()
		})

		so.On("/node/replace", func(_ string) (int, interface{}) {
			return NodeHandler.replace_node()
		})
	})
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
	SocketRouter(&base.server)
	base.server.On("error", func(so socketio.Socket, err error) {
		base.logCh <- fmt.Sprintf("socket.io error: %s", err.Error())
	})
	http.Handle("/socket.io/", base.server)

	handler.SetupBase(base.server, base.clients)

}

// anja@anja-ThinkPad:~/go/src/github.com$ go get github.com/transceptor-technology/go-socket.io
// # github.com/transceptor-technology/go-socket.io
// transceptor-technology/go-socket.io/parser.go:50:16: undefined: engineio.MessageType
// transceptor-technology/go-socket.io/parser.go:54:13: undefined: engineio.MessageType
// transceptor-technology/go-socket.io/parser.go:94:32: undefined: engineio.MessageText
// transceptor-technology/go-socket.io/parser.go:134:32: undefined: engineio.MessageBinary
// transceptor-technology/go-socket.io/parser.go:182:11: undefined: engineio.MessageText
// transceptor-technology/go-socket.io/parser.go:332:11: undefined: engineio.MessageText
// transceptor-technology/go-socket.io/server.go:18:32: cannot use transportNames (type []string) as type *engineio.Options in argument to engineio.NewServer
// transceptor-technology/go-socket.io/server.go:32:7: s.eio.SetPingTimeout undefined (type *engineio.Server has no field or method SetPingTimeout)
// transceptor-technology/go-socket.io/server.go:37:7: s.eio.SetPingInterval undefined (type *engineio.Server has no field or method SetPingInterval)
// transceptor-technology/go-socket.io/server.go:76:45: undefined: engineio.Sessions
// transceptor-technology/go-socket.io/server.go:37:7: too many errors
