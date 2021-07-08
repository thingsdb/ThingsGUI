package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	things "github.com/thingsdb/go-thingsdb"
)

// Client type
type Client struct {
	Closed          chan bool
	Connection      *things.Conn
	ConnectionsPath string
	EventCh         chan *things.Event
	Host            string
	LogCh           chan string
	Pass            string
	Port            uint16
	SessionPath     string
	Ssl             *tls.Config
	TmpFiles        *TmpFiles
	Token           string
	User            string
	Cookie          *http.Cookie
}

// AuthResp type
type AuthResp struct {
	AuthOnly   bool
	AuthMethod string
}

// LoginResp type
type LoginResp struct {
	Loaded    bool
	Connected bool
	ConnErr   string
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

type LMapping map[string]map[string]interface{}
type LData map[string]interface{}

func connect(client *Client, data LoginData) LoginResp {
	hp := strings.Split(data.Address, ":")
	if len(hp) != 2 {
		return LoginResp{Connected: false, ConnErr: "invalid node name/address"}
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return LoginResp{Connected: false, ConnErr: err.Error()}
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
			return LoginResp{Connected: false, ConnErr: err.Error()}
		}
	}
	if data.IsToken {
		err := client.Connection.AuthToken(data.Token)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err.Error()}
		}

		client.Token = data.Token

		// Add session if cookie is set
		if client.Cookie != nil {
			addSession(*client.Cookie, data)
		}
	} else {
		err := client.Connection.AuthPassword(data.User, data.Password)
		if err != nil {
			return LoginResp{Connected: false, ConnErr: err.Error()}
		}
		client.User = data.User
		client.Pass = data.Password
	}

	// If connection successfull, save this in the session file.
	err = saveLastUsedConnection(client, data)
	if err != nil {
		client.LogCh <- fmt.Sprintf("Last used connection could not be saved: %s.", err)
	}

	return LoginResp{Connected: true}
}

// Connected returns if a connection with ThingsDB is established
func Connected(client *Client) (int, LoginResp, Message) {
	var resp LoginResp
	conn := client.Connection
	switch {
	case conn == nil:
		resp = connectViaCache(client, client.SessionPath, lastUsedKey)
		if !resp.Connected && client.Cookie != nil {
			if data := getSession(client.Cookie.Value); data != nil {
				resp = connect(client, *data)
			}
		}

	case conn.IsConnected():
		resp.Connected = true
	default:
		resp.Connected = false
	}

	resp.Loaded = true
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, resp, message
}

// ConnectToNew connects to a new ThingsDB connnection
func ConnectToNew(client *Client, data LoginData) (int, LoginResp, Message) {
	var resp LoginResp
	var message Message
	resp = connect(
		client,
		data,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = Message{Text: resp.ConnErr, Status: http.StatusInternalServerError, Log: resp.ConnErr}
	}
	return message.Status, resp, message
}

// ConnectViaCache connects via cached auth data to ThingsDB
func ConnectViaCache(client *Client, data LoginData) (int, LoginResp, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	resp := connectViaCache(client, client.ConnectionsPath, data.Name)

	if resp.Connected {
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = Message{Text: resp.ConnErr, Status: http.StatusInternalServerError, Log: resp.ConnErr}
	}
	return message.Status, resp, message
}

// connectViaCache connects via cached auth data to ThingsDB
func connectViaCache(client *Client, path string, name string) LoginResp {
	fileNotExist := FileNotExist(path)
	if fileNotExist {
		return LoginResp{Connected: false, ConnErr: "File does not exist"}
	}

	var mapping = make(map[string]LoginData)
	err := ReadEncryptedFile(path, &mapping, client.LogCh)
	if err != nil {
		return LoginResp{Connected: false, ConnErr: err.Error()}
	}

	resp := connect(
		client,
		mapping[name],
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
	}
	return resp
}

// AuthKey connects to ThingsDB via a key and API request to get the access token
func AuthKey(client *Client, data map[string]string, address string, ssl bool, aic bool, tokenAPI string) (int, interface{}, Message) {
	jsonData := map[string]string{"key": data["key"]} // url.Query().Get("key")}
	jsonValue, _ := json.Marshal(jsonData)
	response, err := http.Post(tokenAPI, "application/json", bytes.NewBuffer(jsonValue))

	if err != nil {
		return internalError(err)
	}

	if response.StatusCode < 200 || response.StatusCode > 299 {
		return internalError(fmt.Errorf("Invalid key"))
	}

	type Resp struct {
		Token string `json:"token"`
	}

	var resp Resp
	json.NewDecoder(response.Body).Decode(&resp)

	d := map[string]string{"token": resp.Token}
	return AuthToken(client, d, address, ssl, aic)
}

// AuthOnly checks if the address and auth method are provided in the .env file; in that case only auth can be supplied by the user
func AuthOnly(address string, authMethod string) (int, AuthResp, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	var auth AuthResp
	if address != "" {
		auth.AuthOnly = true
		auth.AuthMethod = authMethod
	}
	return message.Status, auth, message
}

// AuthToken connects to ThingsDB using the token and env variables
func AuthToken(client *Client, data map[string]string, address string, ssl bool, aic bool) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	mapping := LoginData{
		Address:            address,
		IsToken:            true,
		Token:              data["token"],
		SecureConnection:   ssl,
		InsecureSkipVerify: aic,
	}

	resp := connect(
		client,
		mapping,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = Message{Text: resp.ConnErr, Status: http.StatusInternalServerError, Log: resp.ConnErr}
	}
	return message.Status, resp, message
}

// AuthPass connects to ThingsDB using a user+pass and env variables
func AuthPass(client *Client, data map[string]string, address string, ssl bool, aic bool) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	mapping := LoginData{
		Address:            address,
		IsToken:            false,
		User:               data["user"],
		Password:           data["pass"],
		SecureConnection:   ssl,
		InsecureSkipVerify: aic,
	}

	resp := connect(
		client,
		mapping,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	} else {
		message = Message{Text: resp.ConnErr, Status: http.StatusInternalServerError, Log: resp.ConnErr}
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
func Reconnect(client *Client) (int, LoginResp, Message) {
	resp := LoginResp{Connected: true}
	message := Message{Text: "", Status: http.StatusOK, Log: ""}

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
func Disconnect(client *Client) (int, LoginResp, Message) {
	if client.Cookie != nil {
		resetSession(client.Cookie.Value)
	}
	CloseSingleConn(client)
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	return message.Status, LoginResp{Loaded: true, Connected: false}, message
}

// CloseSingleConn closes a connection to ThingsDB
func CloseSingleConn(client *Client) {
	if client.Connection != nil {
		client.Connection.Close()
		<-client.Closed
	}
}

// GetCachedConnections gets all the cached connections
func GetCachedConnections(client *Client) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}

	var mapping = make(map[string]LoginData)
	err := ReadEncryptedFile(client.ConnectionsPath, &mapping, client.LogCh)
	if err != nil {
		client.LogCh <- err.Error()

		// For backwards compatability
		oldPath := GetHomePath(oldConnFile)
		if notExist := FileNotExist(oldPath); !notExist {
			err = ReadEncryptedFile(oldPath, &mapping, client.LogCh)
			if err != nil {
				client.LogCh <- err.Error()
				return message.Status, nil, message
			}

			_, err := CreateFile(client.ConnectionsPath, client.LogCh)
			if err != nil {
				client.LogCh <- err.Error()
				return message.Status, nil, message
			}

			err = WriteEncryptedFile(client.ConnectionsPath, mapping, client.LogCh)
			if err != nil {
				client.LogCh <- err.Error()
				return message.Status, nil, message
			}

			err = DeleteFile(GetHomePath(oldConnFile), client.LogCh)
			if err != nil {
				client.LogCh <- err.Error()
				return message.Status, nil, message
			}
		} else {
			return message.Status, nil, message
		}
	}

	var resp = make(map[string]LoginData)
	for k, v := range mapping {
		v.Password = ""
		v.Token = ""

		resp[k] = v
	}

	return message.Status, resp, message
}

// NewCachedConnection saves a new connection locally
func NewCachedConnection(client *Client, data LData) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	fn := func(mapping LMapping) error {
		name := data["name"].(string)
		if _, ok := mapping[name]; ok {
			return fmt.Errorf("\"%s\" does already exist.", name)
		}

		mapping[name] = data
		return nil
	}

	var mapping = make(LMapping)
	err := changeFile(client.ConnectionsPath, client.LogCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// EditCachedConnection edits a connection locally
func EditCachedConnection(client *Client, data LData) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	fn := func(mapping LMapping) error {
		name := data["name"].(string)
		for k, v := range data {
			mapping[name][k] = v
		}

		return nil
	}

	var mapping = make(LMapping)
	err := changeFile(client.ConnectionsPath, client.LogCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// RenameCachedConnection renames a connection locally
func RenameCachedConnection(client *Client, data LData) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	fn := func(mapping LMapping) error {
		newName := data["newName"].(string)
		oldName := data["oldName"].(string)

		if _, ok := mapping[newName]; ok {
			return fmt.Errorf("\"%s\" does already exist.", newName)
		}

		mapping[newName] = mapping[oldName]
		mapping[newName]["name"] = newName
		delete(mapping, oldName)

		return nil
	}

	var mapping = make(LMapping)
	err := changeFile(client.ConnectionsPath, client.LogCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// DelCachedConnection deletes a saved connection
func DelCachedConnection(client *Client, data LoginData) (int, interface{}, Message) {
	message := Message{Text: "", Status: http.StatusOK, Log: ""}

	fileNotExist := FileNotExist(client.ConnectionsPath)
	if fileNotExist {
		return internalError(fmt.Errorf("File does not exist"))
	}

	var mapping = make(map[string]LoginData)
	err := ReadEncryptedFile(client.ConnectionsPath, &mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	delete(mapping, data.Name)
	err = WriteEncryptedFile(client.ConnectionsPath, mapping, client.LogCh)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// saveLastUsedConnection saved the last used successfull connection.
func saveLastUsedConnection(client *Client, data LoginData) error {
	// Convert LoginData to LData
	ldata := make(LData)
	lbytes, _ := json.Marshal(data)
	json.Unmarshal(lbytes, &ldata)

	fn := func(mapping LMapping) error {
		mapping[lastUsedKey] = ldata
		return nil
	}
	var mapping = make(LMapping)
	return changeFile(client.SessionPath, client.LogCh, mapping, fn)
}

// changeFile creates or makes change to an existing file.
func changeFile(path string, logCh chan string, mapping LMapping, fn func(LMapping) error) error {
	newFile, err := CreateFile(path, logCh)
	if err != nil {
		return err
	}

	if !newFile {
		err = ReadEncryptedFile(path, &mapping, logCh)
		if err != nil {
			err = DeleteFile(path, logCh)
			if err != nil {
				return err
			}

			_, err := CreateFile(path, logCh)
			if err != nil {
				return err
			}
		}
	}

	err = fn(mapping)
	if err != nil {
		return err
	}

	err = WriteEncryptedFile(path, mapping, logCh)
	if err != nil {
		return err
	}

	return nil
}

func internalError(err error) (int, interface{}, Message) {
	message := Message{Text: err.Error(), Status: http.StatusInternalServerError, Log: err.Error()}
	return message.Status, nil, message
}
