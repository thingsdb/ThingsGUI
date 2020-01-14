package handlers

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type Client struct {
	Connection *things.Conn
	Closed     chan bool
	LogCh      chan string
	TmpFiles   *util.TmpFiles
	Ssl        *tls.Config
	HomePath   string
	User       string
	Pass       string
	Token      string
}

type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   error
}

type LoginData struct {
	Name               string `json:"name"`
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
	client.Connection.EventCh = make(chan *things.Event)
	client.Connection.LogCh = client.LogCh
	client.Connection.OnClose = func(err error) {
		go func() {
			fmt.Println("onClose", err)
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
		client.User = data.User
		client.Pass = data.Password
	} else {
		err := client.Connection.AuthToken(data.Token)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
		client.Token = data.Token
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

func Reconnect(client *Client) (int, LoginResp, util.Message) {
	resp := LoginResp{Connected: true}
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}

	maxInterval := 240
	interval := 1
	fmt.Println(client.Connection.IsConnected(), "hi", client.Connection)
	for interval < maxInterval && client.Connection.IsConnected() {
		err := client.Connection.Connect()
		fmt.Println("errorrrr:", err)
		if err != nil {
			client.LogCh <- fmt.Sprintf("connecting to %s:%d failed, \ntry next connect in %d seconds", client.Connection.Host, client.Connection.Port, interval)
			message = util.Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
			resp = LoginResp{Connected: false}
		} else {
			if client.Token == "" {
				err := client.Connection.AuthPassword(client.User, client.Pass)
				if err != nil {
					resp = LoginResp{Connected: true}
					message = util.Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
				}
			} else {
				err := client.Connection.AuthToken(client.Token)
				if err != nil {
					resp = LoginResp{Connected: true}
					message = util.Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
				}
			}
			return message.Status, resp, message
		}

		interval *= 2
		timeoutCh := make(chan bool, 1)
		fmt.Println(interval)

		go func() {
			fmt.Println("hoi")
			time.Sleep(time.Duration(interval) * time.Second)
			timeoutCh <- true
		}()

		<-timeoutCh
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

func GetConnection(client *Client) (int, interface{}, util.Message) {
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}

	var mapping = make(map[string]LoginData)
	err := util.ReadEncryptedFile(client.HomePath, &mapping, client.LogCh)
	if err != nil {
		client.LogCh <- err.Error()
		return message.Status, nil, message
	}

	var resp = make(map[string]LoginData)
	for k, v := range mapping {
		v.Password = ""

		resp[k] = v
	}

	return message.Status, resp, message
}

func NewEditConnection(client *Client, data LoginData) (int, interface{}, util.Message) {
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	var mapping = make(map[string]LoginData)

	newFile, err := util.CreateFile(client.HomePath, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	if !newFile {
		err = util.ReadEncryptedFile(client.HomePath, &mapping, client.LogCh)
		if err != nil {
			return internalError(err)
		}
	}

	mapping[data.Name] = data
	err = util.WriteEncryptedFile(client.HomePath, mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

func DelConnection(client *Client, data LoginData) (int, interface{}, util.Message) {
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}

	fileNotExist := util.FileNotExist(client.HomePath)
	if fileNotExist {
		return internalError(fmt.Errorf("File does not exist"))
	}

	var mapping = make(map[string]LoginData)
	err := util.ReadEncryptedFile(client.HomePath, &mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	delete(mapping, data.Name)
	err = util.WriteEncryptedFile(client.HomePath, mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

func ConnectionToo(client *Client, data LoginData) (int, interface{}, util.Message) {
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}

	fileNotExist := util.FileNotExist(client.HomePath)
	if fileNotExist {
		return internalError(fmt.Errorf("File does not exist"))
	}

	var mapping = make(map[string]LoginData)
	err := util.ReadEncryptedFile(client.HomePath, &mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	resp := connect(
		client,
		mapping[data.Name],
	)

	if resp.Connected {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = util.Message{Text: resp.ConnErr.Error(), Status: http.StatusInternalServerError, Log: resp.ConnErr.Error()}
	}
	return message.Status, resp, message
}

func internalError(err error) (int, interface{}, util.Message) {
	message := util.Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
	return message.Status, nil, message
}
