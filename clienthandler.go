package main

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	socketio "github.com/googollee/go-socket.io"
	things "github.com/thingsdb/go-thingsdb"
)

// For backwards compatability
var oldConnFile = ".things-gui_config"
var lastUsedKey = "lastUsedKey"

// client type
type client struct {
	connection      *things.Conn
	connectionsPath string
	cookie          *http.Cookie
	host            string
	logCh           chan string
	pass            string
	port            uint16
	sessionPath     string
	ssl             *tls.Config
	tmpFiles        *tmpFiles
	token           string
	user            string
}

// connResp type
type connResp struct {
	Connected  bool
	UseCookies bool
}

// loginData type
type loginData struct {
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

// loginResp type
type loginResp struct {
	Address            string `json:"address"`
	InsecureSkipVerify bool   `json:"insecureSkipVerify"`
	IsToken            bool   `json:"isToken"`
	Memo               string `json:"memo"`
	Name               string `json:"name"`
	SecureConnection   bool   `json:"secureConnection"`
	User               string `json:"user"`
}

type lMapping map[string]map[string]interface{}
type lData map[string]interface{}

type procedure struct {
	Arguments string `json:"arguments"`
	Name      string `json:"name"`
}

// Data struct that received
type dataReq struct {
	Arguments map[string]interface{} `json:"arguments"`
	Blob      map[string]string      `json:"blob"`
	Id        string                 `json:"id"`
	Procedure procedure              `json:"procedure"`
	Query     string                 `json:"query"`
	Scope     string                 `json:"scope"`
	Wait      int                    `json:"wait"`
}

func connectedResp() connResp {
	return connResp{
		Connected:  true,
		UseCookies: useCookieSession,
	}
}

func disconnectedResp() connResp {
	return connResp{
		Connected:  false,
		UseCookies: useCookieSession,
	}
}

func (client *client) connect(data loginData) (connResp, error) {
	hp := strings.Split(data.Address, ":")
	if len(hp) != 2 {
		return disconnectedResp(), fmt.Errorf("invalid node name/address")
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return disconnectedResp(), err
	}
	host := hp[0]

	client.ssl = nil // if ssl not supported, this will reset the ssl prop
	if data.SecureConnection {
		client.ssl = &tls.Config{}
		client.ssl.InsecureSkipVerify = data.InsecureSkipVerify
	}
	client.host = host
	client.port = uint16(port)
	client.connection = things.NewConn(host, uint16(port), client.ssl)
	client.connection.LogCh = client.logCh
	client.connection.DefaultTimeout = time.Duration(timeout) * time.Second
	client.connection.LogLevel = things.LogDebug

	client.user = ""
	client.pass = ""
	client.token = ""
	if !client.connection.IsConnected() {
		err := client.connection.Connect()
		if err != nil {
			return disconnectedResp(), err
		}
	}
	if data.IsToken {
		err := client.connection.AuthToken(data.Token)
		if err != nil {
			return disconnectedResp(), err
		}
		client.token = data.Token

	} else {
		err := client.connection.AuthPassword(data.User, data.Password)
		if err != nil {
			return disconnectedResp(), err
		}
		client.user = data.User
		client.pass = data.Password
	}

	// Store session in local file (~/.config/ThingsGUI/thingsgui.session).
	if useLocalSession {
		err = client.saveLastUsedConnection(data)
		if err != nil {
			client.logCh <- fmt.Sprintf("Last used connection could not be saved: %s.", err)
		}
	}

	// Store session in memory
	if useCookieSession && client.cookie != nil {
		addSession(*client.cookie, data)
	}

	return connectedResp(), nil
}

// connected returns if a connection with ThingsDB is established
func (client *client) connected() (int, connResp, message) {
	resp := disconnectedResp()
	conn := client.connection
	switch {
	case conn == nil:
		if useLocalSession {
			resp, _ = client.connectViaCache(client.sessionPath, lastUsedKey)
		}

		if !resp.Connected && useCookieSession && client.cookie != nil {
			if data := getSession(client.cookie.Value); data != nil {
				resp, _ = client.connect(*data)
			}
		}

	case conn.IsConnected():
		resp.Connected = true
	default:
		resp.Connected = false
	}

	message := successMsg()
	return message.Status, resp, message
}

// connectToNew connects to a new ThingsDB connnection
func (client *client) connectToNew(data loginData) (int, connResp, message) {
	var message message
	resp, err := client.connect(data)

	if resp.Connected {
		message = successMsg()
	} else {
		message = failedMsg(err)
	}
	return message.Status, resp, message
}

// handlerConnectViaCache connects via cached auth data to ThingsDB
func (client *client) handlerConnectViaCache(data loginData) (int, connResp, message) {
	message := successMsg()
	resp, err := client.connectViaCache(client.connectionsPath, data.Name)

	if !resp.Connected {
		message = failedMsg(err)
	}
	return message.Status, resp, message
}

// connectViaCache connects via cached auth data to ThingsDB
func (client *client) connectViaCache(path string, name string) (connResp, error) {
	fileNotExist := fileNotExist(path)
	if fileNotExist {
		return disconnectedResp(), fmt.Errorf("File does not exist")
	}

	var mapping = make(map[string]loginData)
	err := readEncryptedFile(path, &mapping, client.logCh)
	if err != nil {
		return disconnectedResp(), err
	}

	resp, err := client.connect(mapping[name])
	return resp, err
}

// authKey connects to ThingsDB via a key and API request to get the access token
func (client *client) authKey(data map[string]string) (int, interface{}, message) {
	jsonData := map[string]string{"key": data["key"]} // url.Query().Get("key")}
	jsonValue, _ := json.Marshal(jsonData)
	response, err := http.Post(thingsguiTokenApi, "application/json", bytes.NewBuffer(jsonValue))

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
	return client.authToken(d)
}

// authToken connects to ThingsDB using the token and env variables
func (client *client) authToken(data map[string]string) (int, interface{}, message) {
	message := successMsg()
	mapping := loginData{
		Address:            thingsguiAddress,
		InsecureSkipVerify: thingsguiAic,
		IsToken:            true,
		SecureConnection:   thingsguiSsl,
		Token:              data["token"],
	}

	resp, err := client.connect(mapping)

	if !resp.Connected {
		message = failedMsg(err)
	}
	return message.Status, resp, message
}

// authPass connects to ThingsDB using a user+pass and env variables
func (client *client) authPass(data map[string]string) (int, interface{}, message) {
	message := successMsg()
	mapping := loginData{
		Address:            thingsguiAddress,
		InsecureSkipVerify: thingsguiAic,
		IsToken:            false,
		Password:           data["pass"],
		SecureConnection:   thingsguiSsl,
		User:               data["user"],
	}

	resp, err := client.connect(mapping)

	if !resp.Connected {
		message = failedMsg(err)
	}
	return message.Status, resp, message
}

func (client *client) seekConnection() bool {
	if client.connection.IsConnected() {
		client.logCh <- fmt.Sprintf("Node is still closing.")
		return false
	}
	err := client.connection.Connect()
	if err != nil {
		client.logCh <- err.Error()
		return false
	}
	if client.token == "" {
		err := client.connection.AuthPassword(client.user, client.pass)
		if err != nil {
			client.logCh <- err.Error()
			return false
		}
	} else {
		err := client.connection.AuthToken(client.token)
		if err != nil {
			client.logCh <- err.Error()
			return false
		}
	}
	return true
}

// reconnect to ThingsDB when a connection is lost.
func (client *client) reconnect() (int, connResp, message) {
	maxInterval := 60
	interval := 1
	timeoutCh := make(chan bool, 1)

	for interval < maxInterval {
		if success := client.seekConnection(); success {
			resp := connectedResp()
			message := successMsg()
			return message.Status, resp, message
		} else {
			interval *= 2
			client.logCh <- fmt.Sprintf("connecting to %s:%d failed, \ntry next connect in %d seconds", client.host, client.port, interval)
			go func() {
				time.Sleep(time.Duration(interval) * time.Second)
				timeoutCh <- true
			}()
			<-timeoutCh
		}
	}

	resp := disconnectedResp()
	message := failedMsg(fmt.Errorf("Reconnecting has stopped. Timeout reached."))
	return message.Status, resp, message
}

// disconnect closes a connection to ThingsDB
func (client *client) disconnect() (int, connResp, message) {
	if useLocalSession {
		client.saveLastUsedConnection(loginData{})
	}
	if useCookieSession && client.cookie != nil {
		resetSession(client.cookie.Value)
	}
	client.closeSingleConn()
	message := successMsg()
	return message.Status, disconnectedResp(), message
}

// closeSingleConn closes a connection to ThingsDB
func (client *client) closeSingleConn() {
	if client.connection != nil {
		client.connection.Close()
	}
}

// getCachedConnections gets all the cached connections
func (client *client) getCachedConnections() (int, interface{}, message) {
	message := successMsg()

	var mapping = make(map[string]loginResp)
	err := readEncryptedFile(client.connectionsPath, &mapping, client.logCh)

	if err != nil {
		client.logCh <- err.Error()

		// For backwards compatability
		oldPath := getHomePath(oldConnFile)
		if notExist := fileNotExist(oldPath); !notExist {
			err = readEncryptedFile(oldPath, &mapping, client.logCh)
			if err != nil {
				client.logCh <- err.Error()
				return message.Status, nil, message
			}

			_, err := createFile(client.connectionsPath, client.logCh)
			if err != nil {
				client.logCh <- err.Error()
				return message.Status, nil, message
			}

			err = writeEncryptedFile(client.connectionsPath, mapping, client.logCh)
			if err != nil {
				client.logCh <- err.Error()
				return message.Status, nil, message
			}

			err = deleteFile(getHomePath(oldConnFile), client.logCh)
			if err != nil {
				client.logCh <- err.Error()
				return message.Status, nil, message
			}
		} else {
			return message.Status, nil, message
		}
	}

	return message.Status, mapping, message
}

// newCachedConnection saves a new connection locally
func (client *client) newCachedConnection(data lData) (int, interface{}, message) {
	message := successMsg()
	fn := func(mapping lMapping) error {
		name := data["name"].(string)
		if _, ok := mapping[name]; ok {
			return fmt.Errorf("\"%s\" does already exist.", name)
		}

		mapping[name] = data
		return nil
	}

	var mapping = make(lMapping)
	err := changeFile(client.connectionsPath, client.logCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// editCachedConnection edits a connection locally
func (client *client) editCachedConnection(data lData) (int, interface{}, message) {
	message := successMsg()
	fn := func(mapping lMapping) error {
		name := data["name"].(string)
		for k, v := range data {
			mapping[name][k] = v
		}

		return nil
	}

	var mapping = make(lMapping)
	err := changeFile(client.connectionsPath, client.logCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// renameCachedConnection renames a connection locally
func (client *client) renameCachedConnection(data lData) (int, interface{}, message) {
	message := successMsg()
	fn := func(mapping lMapping) error {
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

	var mapping = make(lMapping)
	err := changeFile(client.connectionsPath, client.logCh, mapping, fn)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// delCachedConnection deletes a saved connection
func (client *client) delCachedConnection(data loginData) (int, interface{}, message) {
	message := successMsg()

	fileNotExist := fileNotExist(client.connectionsPath)
	if fileNotExist {
		return internalError(fmt.Errorf("File does not exist"))
	}

	var mapping = make(map[string]loginData)
	err := readEncryptedFile(client.connectionsPath, &mapping, client.logCh)
	if err != nil {
		return internalError(err)
	}

	delete(mapping, data.Name)
	err = writeEncryptedFile(client.connectionsPath, mapping, client.logCh)
	if err != nil {
		return internalError(err)
	}

	return message.Status, nil, message
}

// saveLastUsedConnection saved the last used successfull connection.
func (client *client) saveLastUsedConnection(data loginData) error {
	// Convert loginData to lData
	ldata := make(lData)
	lbytes, _ := json.Marshal(data)
	json.Unmarshal(lbytes, &ldata)

	fn := func(mapping lMapping) error {
		mapping[lastUsedKey] = ldata
		return nil
	}
	var mapping = make(lMapping)
	return changeFile(client.sessionPath, client.logCh, mapping, fn)
}

// query sends a query to ThingsDB and receives a result
func (client *client) query(data dataReq) (int, interface{}, message) {
	for k, v := range data.Blob {
		decodedBlob, err := base64.StdEncoding.DecodeString(v)
		if err != nil {
			message := failedMsg(err)
			return message.Status, "", message
		}

		if data.Arguments == nil {
			data.Arguments = make(map[string]interface{})
		}
		data.Arguments[k] = decodedBlob
	}

	resp, err := client.connection.Query(
		data.Scope,
		data.Query,
		data.Arguments)

	if err != nil {
		message := createThingsDBError(err)
		return message.Status, "", message
	}

	var r interface{}
	r, err = client.tmpFiles.replaceBinStrWithLink(resp)
	message := msg(err)
	if r != nil {
		resp = r
	}
	return message.Status, resp, message
}

// Join a room
func (client *client) join(socket socketio.Conn, data dataReq) (int, interface{}, message) {
	scope := data.Scope
	id := data.Id
	wait := time.Duration(data.Wait) * time.Second
	idInt, _ := strconv.ParseUint(id, 10, 64)

	room := things.NewRoomFromId(scope, idInt)

	room.OnInit = func(room *things.Room) {
		socket.Emit("onInit", room.Id())
	}

	room.OnJoin = func(room *things.Room) {
		socket.Emit("onJoin", room.Id())
	}
	room.OnLeave = func(room *things.Room) {
		socket.Emit("onLeave", room.Id())
	}
	room.OnDelete = func(room *things.Room) {
		socket.Emit("onDelete", room.Id())
	}
	room.OnEvent = func(room *things.Room, id uint64, event string, args []interface{}) {
		socket.Emit("onEvent", room.Id(), id, event, args)
	}

	err := room.Join(client.connection, wait)
	message := msg(err)
	return message.Status, nil, message
}

// Leave a room
func (client *client) leave(data dataReq) (int, interface{}, message) {
	id := data.Id
	roomId, _ := strconv.ParseUint(id, 10, 64)

	room, err := client.connection.GetRoomFromId(roomId)
	if err == nil {
		err = room.Leave()
	}

	message := msg(err)
	return message.Status, nil, message
}

// run the procedure that is provided
func (client *client) run(data dataReq) (int, interface{}, message) {
	var args interface{}
	message := successMsg()
	if data.Procedure.Name != "" {
		decoder := json.NewDecoder(strings.NewReader(data.Procedure.Arguments))
		if err := decoder.Decode(&args); err != nil {
			message = msg(err)
			return message.Status, "", message
		}
		args = convertFloatToInt(args)
	}

	resp, err := client.connection.Run(data.Scope, data.Procedure.Name, args)
	if err != nil {
		message = createThingsDBError(err)
	}
	return message.Status, resp, message
}
