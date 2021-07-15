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
	Cookie          *http.Cookie
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
}

// AuthResp type
type AuthResp struct {
	AuthMethod string
	AuthOnly   bool
}

// LoginResp type
type LoginResp struct {
	Connected  bool
	UseCookies bool
}

// LoginData type
type LoginData struct {
	Address            string `json:"address"`
	InsecureSkipVerify bool   `json:"insecureSkipVerify"`
	IsToken            bool   `json:"isToken"`
	Memo               string `json:"memo"`
	Name               string `json:"name"`
	Password           string `json:"password"`
	SecureConnection   bool   `json:"secureConnection"`
	Token              string `json:"token"`
	User               string `json:"user"`
}

type LMapping map[string]map[string]interface{}
type LData map[string]interface{}

func connectedResp() *LoginResp {
	return &LoginResp{
		Connected:  true,
		UseCookies: useCookieSession,
	}
}

func disconnectedResp() *LoginResp {
	return &LoginResp{
		Connected:  false,
		UseCookies: useCookieSession,
	}
}

func connect(client *Client, data LoginData) (*LoginResp, error) {
	hp := strings.Split(data.Address, ":")
	if len(hp) != 2 {
		return disconnectedResp(), fmt.Errorf("invalid node name/address")
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return disconnectedResp(), err
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
			return disconnectedResp(), err
		}
	}
	if data.IsToken {
		err := client.Connection.AuthToken(data.Token)
		if err != nil {
			return disconnectedResp(), err
		}
		client.Token = data.Token

	} else {
		err := client.Connection.AuthPassword(data.User, data.Password)
		if err != nil {
			return disconnectedResp(), err
		}
		client.User = data.User
		client.Pass = data.Password
	}

	// Store session in local file (~/.config/ThingsGUI/thingsgui.session).
	if useLocalSession {
		err = saveLastUsedConnection(client, data)
		if err != nil {
			client.LogCh <- fmt.Sprintf("Last used connection could not be saved: %s.", err)
		}
	}

	// Store session in memory
	if useCookieSession && client.Cookie != nil {
		addSession(*client.Cookie, data)
	}

	return connectedResp(), nil
}

// Connected returns if a connection with ThingsDB is established
func Connected(client *Client) (int, *LoginResp, Message) {
	resp := disconnectedResp()
	conn := client.Connection
	switch {
	case conn == nil:
		if useLocalSession {
			resp, _ = connectViaCache(client, client.SessionPath, lastUsedKey)
		}

		if !resp.Connected && useCookieSession && client.Cookie != nil {
			if data := getSession(client.Cookie.Value); data != nil {
				resp, _ = connect(client, *data)
			}
		}

	case conn.IsConnected():
		resp.Connected = true
	default:
		resp.Connected = false
	}

	message := SuccessMsg()
	return message.Status, resp, message
}

// ConnectToNew connects to a new ThingsDB connnection
func ConnectToNew(client *Client, data LoginData) (int, *LoginResp, Message) {
	var message Message
	resp, err := connect(
		client,
		data,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
		message = SuccessMsg()
	} else {
		message = FailedMsg(err)
	}
	return message.Status, resp, message
}

// ConnectViaCache connects via cached auth data to ThingsDB
func ConnectViaCache(client *Client, data LoginData) (int, *LoginResp, Message) {
	message := SuccessMsg()
	resp, err := connectViaCache(client, client.ConnectionsPath, data.Name)

	if !resp.Connected {
		message = FailedMsg(err)
	}
	return message.Status, resp, message
}

// connectViaCache connects via cached auth data to ThingsDB
func connectViaCache(client *Client, path string, name string) (*LoginResp, error) {
	fileNotExist := FileNotExist(path)
	if fileNotExist {
		return disconnectedResp(), fmt.Errorf("File does not exist")
	}

	var mapping = make(map[string]LoginData)
	err := ReadEncryptedFile(path, &mapping, client.LogCh)
	if err != nil {
		return disconnectedResp(), err
	}

	resp, err := connect(
		client,
		mapping[name],
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
	}
	return resp, err
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
	message := SuccessMsg()
	var auth AuthResp
	if address != "" {
		auth.AuthOnly = true
		auth.AuthMethod = authMethod
	}
	return message.Status, auth, message
}

// AuthToken connects to ThingsDB using the token and env variables
func AuthToken(client *Client, data map[string]string, address string, ssl bool, aic bool) (int, interface{}, Message) {
	message := SuccessMsg()
	mapping := LoginData{
		Address:            address,
		IsToken:            true,
		Token:              data["token"],
		SecureConnection:   ssl,
		InsecureSkipVerify: aic,
	}

	resp, err := connect(
		client,
		mapping,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
	} else {
		message = FailedMsg(err)
	}
	return message.Status, resp, message
}

// AuthPass connects to ThingsDB using a user+pass and env variables
func AuthPass(client *Client, data map[string]string, address string, ssl bool, aic bool) (int, interface{}, Message) {
	message := SuccessMsg()
	mapping := LoginData{
		Address:            address,
		IsToken:            false,
		User:               data["user"],
		Password:           data["pass"],
		SecureConnection:   ssl,
		InsecureSkipVerify: aic,
	}

	resp, err := connect(
		client,
		mapping,
	)

	if resp.Connected {
		client.Connection.EnableKeepAlive()
	} else {
		message = FailedMsg(err)
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
func Reconnect(client *Client) (int, *LoginResp, Message) {
	maxInterval := 60
	interval := 1
	timeoutCh := make(chan bool, 1)

	for interval < maxInterval {
		if success := reconnect(client); success {
			client.Connection.EnableKeepAlive()

			resp := connectedResp()
			message := SuccessMsg()
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

	resp := disconnectedResp()
	message := FailedMsg(fmt.Errorf("Reconnecting has stopped. Timeout reached."))
	return message.Status, resp, message
}

// Disconnect closes a connection to ThingsDB
func Disconnect(client *Client) (int, *LoginResp, Message) {
	if useLocalSession {
		saveLastUsedConnection(client, LoginData{})
	}
	if useCookieSession && client.Cookie != nil {
		resetSession(client.Cookie.Value)
	}
	CloseSingleConn(client)
	message := SuccessMsg()
	return message.Status, disconnectedResp(), message
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
	message := SuccessMsg()

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
	message := SuccessMsg()
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
	message := SuccessMsg()
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
	message := SuccessMsg()
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
	message := SuccessMsg()

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
	message := FailedMsg(err)
	return message.Status, nil, message
}
