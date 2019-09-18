package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type Resp struct {
	connected bool
	connErr   error
}

func connect(sid string, logCh chan string, conn *map[string]*things.Conn, address string, user string, password string, token string) Resp {
	hp := strings.Split(address, ":")
	if len(hp) != 2 {
		return Resp{false, fmt.Errorf("invalid address")}
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return Resp{false, err}
	}
	host := hp[0]

	(*conn)[sid] = things.NewConn(host, uint16(port))
	(*conn)[sid].LogCh = logCh
	(*conn)[sid].OnClose = func() {
		delete(*conn, sid)
	}

	if !(*conn)[sid].IsConnected() {
		err := (*conn)[sid].Connect()
		if err != nil {
			return Resp{false, err}
		}
	}

	if password != "" {
		err := (*conn)[sid].AuthPassword(user, password)
		if err != nil {
			return Resp{false, err}
		}
	} else {
		err := (*conn)[sid].AuthToken(token)
		if err != nil {
			return Resp{false, err}
		}
	}
	return Resp{connected: true}
}

func Connected(sid string, conn *map[string]*things.Conn) (int, map[string]bool, util.Message) {
	var resp map[string]bool
	fmt.Println(*conn)
	switch {
	case (*conn)[sid] == nil:
		resp = map[string]bool{
			"loaded":    true,
			"connected": false,
		}
	case (*conn)[sid].IsConnected():
		resp = map[string]bool{
			"loaded":    true,
			"connected": true,
		}
	default:
		resp = map[string]bool{
			"loaded":    true,
			"connected": false,
		}
	}

	message := util.Message{"", http.StatusOK, ""}
	return message.Status, resp, message
}

func Connect(sid string, logCh chan string, conn *map[string]*things.Conn, data map[string]string) (int, Resp, util.Message) {
	var resp Resp
	var message util.Message
	resp = connect(
		sid,
		logCh,
		conn,
		data["host"],
		data["user"],
		data["password"],
		data["token"])

	if resp.connected {
		message = util.Message{"", http.StatusOK, ""}
	} else {
		message = util.Message{resp.connErr.Error(), http.StatusInternalServerError, resp.connErr.Error()}
	}
	return message.Status, resp, message
}

func ConnectOther(sid string, logCh chan string, conn *map[string]*things.Conn, data map[string]string) (int, Resp, util.Message) {
	var resp Resp
	var message util.Message

	CloseSingleConn((*conn)[sid])

	resp = connect(
		sid,
		logCh,
		conn,
		data["host"],
		data["user"],
		data["password"],
		data["token"])

	if resp.connected {
		message = util.Message{"", http.StatusOK, ""}
	} else {
		message = util.Message{resp.connErr.Error(), http.StatusInternalServerError, resp.connErr.Error()}
	}
	return message.Status, resp, message
}

func Disconnect(conn *things.Conn) (int, interface{}, util.Message) {
	CloseSingleConn(conn) // check if really closed?
	message := util.Message{"", http.StatusOK, ""}
	return 0, map[string]interface{}{"connected": false}, message
}

func CloseSingleConn(conn *things.Conn) {
	if conn != nil {
		conn.Close()
	}
}

func CloseAllConn(connections *map[string]*things.Conn) {
	for _, conn := range *connections {
		if conn != nil {
			conn.Close()
		}
	}
}
