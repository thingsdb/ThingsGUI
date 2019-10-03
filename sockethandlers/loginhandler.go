package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   error
}

func connect(sid string, conn map[string]*things.Conn, logCh map[string]chan string, address string, user string, password string, token string) LoginResp {
	hp := strings.Split(address, ":")
	if len(hp) != 2 {
		return LoginResp{Connected: false, ConnErr: fmt.Errorf("invalid address")}
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return LoginResp{Connected: false, ConnErr: err}
	}
	host := hp[0]

	conn[sid] = things.NewConn(host, uint16(port))
	conn[sid].LogCh = logCh[sid]
	conn[sid].OnClose = func() {
		fmt.Println(sid)
		close(logCh[sid])
		delete(conn, sid)
		delete(logCh, sid)
		fmt.Println("end", logCh, conn)
	}

	if !conn[sid].IsConnected() {
		err := conn[sid].Connect()
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	}

	if token == "" {
		err := conn[sid].AuthPassword(user, password)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	} else {
		err := conn[sid].AuthToken(token)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	}
	return LoginResp{Connected: true}
}

func Connected(conn *things.Conn) (int, LoginResp, util.Message) {
	var resp LoginResp
	switch {
	case conn == nil:
		resp = LoginResp{Loaded: true, Connected: false}
	case conn.IsConnected():
		resp = LoginResp{Loaded: true, Connected: true}
	default:
		resp = LoginResp{Loaded: true, Connected: false}
	}
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, resp, message
}

func Connect(sid string, conn map[string]*things.Conn, logCh map[string]chan string, data map[string]string) (int, LoginResp, util.Message) {
	var resp LoginResp
	var message util.Message
	resp = connect(
		sid,
		conn,
		logCh,
		data["host"],
		data["user"],
		data["password"],
		data["token"])

	if resp.Connected {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = util.Message{Text: resp.ConnErr.Error(), Status: http.StatusInternalServerError, Log: resp.ConnErr.Error()}
	}
	return message.Status, resp, message
}

func Disconnect(conn *things.Conn) (int, LoginResp, util.Message) {
	CloseSingleConn(conn) // check if really closed?
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, LoginResp{Loaded: true, Connected: false}, message
}

func CloseSingleConn(conn *things.Conn) {
	if conn != nil {
		conn.Close()
	}
}
