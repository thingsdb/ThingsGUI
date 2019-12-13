package handlers

import (
	"crypto/tls"
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
	Ssl        *tls.Config
}

type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   error
}

type LoginData struct {
	Address            string `json:"address"`
	User               string `json:"user"`
	Password           string `json:"password"`
	Token              string `json:"token"`
	SecureConnection   bool   `json:"secureConnection"`
	InsecureSkipVerify bool   `json:"insecureSkipVerify"`
}

func connect(client *Client, data LoginData) LoginResp {
	hp := strings.Split(data.Address, ":")
	if len(hp) != 2 {
		return LoginResp{Connected: false, ConnErr: fmt.Errorf("invalid address")}
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return LoginResp{Connected: false, ConnErr: err}
	}
	host := hp[0]

	client.Ssl = nil // if ssl not supported, this will reset the ssl prop
	if data.SecureConnection {
		client.Ssl = &tls.Config{}
		client.Ssl.InsecureSkipVerify = data.InsecureSkipVerify
	}

	client.Connection = things.NewConn(host, uint16(port), client.Ssl)
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
	if data.Token == "" {
		err := client.Connection.AuthPassword(data.User, data.Password)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	} else {
		err := client.Connection.AuthToken(data.Token)
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

func Connect(client *Client, data LoginData) (int, LoginResp, util.Message) {
	var resp LoginResp
	var message util.Message
	resp = connect(
		client,
		data,
	)

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
	}
}
