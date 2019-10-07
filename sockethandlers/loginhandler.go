package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type Client struct {
	Connection *things.Conn
	Closed     chan bool
	EventCh    chan *things.Event
	LogCh      chan string
	TmpFiles   *util.TmpFiles
}

type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   error
}

func connect(client *Client, address string, user string, password string, token string) LoginResp {
	hp := strings.Split(address, ":")
	if len(hp) != 2 {
		return LoginResp{Connected: false, ConnErr: fmt.Errorf("invalid address")}
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return LoginResp{Connected: false, ConnErr: err}
	}
	host := hp[0]

	client.Connection = things.NewConn(host, uint16(port))
	client.Connection.EventCh = client.EventCh
	client.Connection.LogCh = client.LogCh
	client.Connection.OnClose = func() {
		go func() {
			client.Closed <- true
		}()
	}

	if !client.Connection.IsConnected() {
		err := client.Connection.Connect()
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	}
	if token == "" {
		fmt.Println(user, password)
		err := client.Connection.AuthPassword(user, password)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	} else {
		err := client.Connection.AuthToken(token)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	}
	return LoginResp{Connected: true}
}

func Connected(conn *things.Conn) (int, LoginResp, util.Message) {
	var resp LoginResp
	fmt.Println("CONNECTED", conn)
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

func Connect(client *Client, data map[string]string) (int, LoginResp, util.Message) {
	var resp LoginResp
	var message util.Message
	resp = connect(
		client,
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

func Disconnect(client *Client) (int, LoginResp, util.Message) {
	CloseSingleConn(client) // check if really closed?
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, LoginResp{Loaded: true, Connected: false}, message
}

func CloseSingleConn(client *Client) {
	if client.Connection != nil {
		client.Connection.Close()
		<-client.Closed
		fmt.Println(client.Connection.IsConnected())

	}
}
