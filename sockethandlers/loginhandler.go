package handlers

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	util "../util"
	things "github.com/thingsdb/go-thingsdb"
)

// Client type
type Client struct {
	Connection *things.Conn
	Closed     chan bool
	LogCh      chan string
	EventCh    chan *things.Event
	TmpFiles   *util.TmpFiles
	Ssl        *tls.Config
	HomePath   string
	User       string
	Pass       string
	Token      string
	Host       string
	Port       uint16
}

// LoginResp type
type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   error
}

// LoginData type
type LoginData struct {
	Name               string `json:"name"`
	Address            string `json:"address"`
	User               string `json:"user"`
	Password           string `json:"password"`
	Token              string `json:"token"`
	SecureConnection   bool   `json:"secureConnection"`
	InsecureSkipVerify bool   `json:"insecureSkipVerify"`
	Memo               string `json:"memo"`
	IsToken            bool   `json:"isToken"`
}

func connect(client *Client, data LoginData) LoginResp {
	hp := strings.Split(data.Address, ":")
	if len(hp) != 2 {
		return LoginResp{Connected: false, ConnErr: fmt.Errorf("invalid node name/address")}
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
	client.Host = host
	client.Port = uint16(port)
	client.Connection = things.NewConn(host, uint16(port), client.Ssl)
	client.Connection.EventCh = client.EventCh
	client.Connection.LogCh = client.LogCh
	client.Connection.OnClose = func(err error) {
		go func() {
			fmt.Println("onClose", err)
			client.Closed <- true
		}()
	}

	client.User = ""
	client.Pass = ""
	client.Token = ""
	if !client.Connection.IsConnected() {
		err := client.Connection.Connect()
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
	}
	if data.IsToken {
		err := client.Connection.AuthToken(data.Token)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
		client.Token = data.Token
	} else {
		err := client.Connection.AuthPassword(data.User, data.Password)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err}
		}
		client.User = data.User
		client.Pass = data.Password
	}
	return LoginResp{Connected: true}
}

// Connected returns if a connection with ThingsDB is established
func Connected(conn *things.Conn) (int, LoginResp, util.Message) {
	var resp LoginResp
	resp.Loaded = true
	switch {
	case conn == nil:
		resp.Connected = false
	case conn.IsConnected():
		resp.Connected = true
	default:
		resp.Connected = false
	}
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, resp, message
}

// Connect to ThingsDB
func Connect(client *Client, data LoginData) (int, LoginResp, util.Message) {
	var resp LoginResp
	var message util.Message
	resp = connect(
		client,
		data,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = util.Message{Text: resp.ConnErr.Error(), Status: http.StatusInternalServerError, Log: resp.ConnErr.Error()}
	}
	return message.Status, resp, message
}

// ConnectionToo connects to ThingsDB using a known saved connection
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
		client.Connection.EnableKeepAlive()
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = util.Message{Text: resp.ConnErr.Error(), Status: http.StatusInternalServerError, Log: resp.ConnErr.Error()}
	}
	return message.Status, resp, message
}

func reconnect(client *Client) bool {
	if client.Connection.IsConnected() {
		client.LogCh <- fmt.Sprintf("Node is still closing.")
		return false
	}
	err := client.Connection.Connect()
	if err != nil {
		client.LogCh <- err.Error()
		return false
	}
	if client.Token == "" {
		err := client.Connection.AuthPassword(client.User, client.Pass)
		if err != nil {
			client.LogCh <- err.Error()
			return false
		}
	} else {
		err := client.Connection.AuthToken(client.Token)
		if err != nil {
			client.LogCh <- err.Error()
			return false
		}
	}
	return true
}

// Reconnect to ThingsDB when a connection is lost.
func Reconnect(client *Client) (int, LoginResp, util.Message) {
	resp := LoginResp{Connected: true}
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}

	maxInterval := 60
	interval := 1
	timeoutCh := make(chan bool, 1)
	for interval < maxInterval {
		if success := reconnect(client); success {
			client.Connection.EnableKeepAlive()
			return message.Status, resp, message
		} else {
			interval *= 2
			client.LogCh <- fmt.Sprintf("connecting to %s:%d failed, \ntry next connect in %d seconds", client.Host, client.Port, interval)
			go func() {
				time.Sleep(time.Duration(interval) * time.Second)
				timeoutCh <- true
			}()
			<-timeoutCh
		}
	}

	message.Text = "Reconnecting has stopped. Timeout reached."
	message.Status = http.StatusInternalServerError
	message.Log = "Reconnecting has stopped. Timeout reached."
	return message.Status, resp, message
}

// Disconnect closes a connection to ThingsDB
func Disconnect(client *Client) (int, LoginResp, util.Message) {
	CloseSingleConn(client)
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, LoginResp{Loaded: true, Connected: false}, message
}

// CloseSingleConn closes a connection to ThingsDB
func CloseSingleConn(client *Client) {
	if client.Connection != nil {
		client.Connection.Close()
		<-client.Closed
	}
}

// GetConnection gets all the saved connections
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
		v.Token = ""

		resp[k] = v
	}

	return message.Status, resp, message
}

// NewConnection saves a new connection locally
func NewConnection(client *Client, data map[string]interface{}) (int, interface{}, util.Message) {
	fn := func(mapping map[string]map[string]interface{}) {
		name := data["name"].(string)
		mapping[name] = data
	}
	return NewEditConnection(client, data, fn)
}

// EditConnection edits a connection locally
func EditConnection(client *Client, data map[string]interface{}) (int, interface{}, util.Message) {
	fn := func(mapping map[string]map[string]interface{}) {
		name := data["name"].(string)
		for k, v := range data {
			mapping[name][k] = v
		}
	}
	return NewEditConnection(client, data, fn)
}

// RenameConnection renames a connection locally
func RenameConnection(client *Client, data map[string]interface{}) (int, interface{}, util.Message) {
	fn := func(mapping map[string]map[string]interface{}) {
		newName := data["newName"].(string)
		oldName := data["oldName"].(string)
		mapping[newName] = mapping[oldName]
		mapping[newName]["name"] = newName
		delete(mapping, oldName)
	}
	return NewEditConnection(client, data, fn)
}

// NewEditConnection saves a new connection or edits locally
func NewEditConnection(client *Client, data map[string]interface{}, fn func(map[string]map[string]interface{})) (int, interface{}, util.Message) {
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	var mapping = make(map[string]map[string]interface{})

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

	fn(mapping)

	err = util.WriteEncryptedFile(client.HomePath, mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// DelConnection deletes a saved connection
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

func internalError(err error) (int, interface{}, util.Message) {
	message := util.Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
	return message.Status, nil, message
}
