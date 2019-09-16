package handlers

import (
	"flag"
	"fmt"
	"net/http"
	"strings"
	"strconv"

	things "github.com/thingsdb/go/client"
	socketio "github.com/googollee/go-socket.io"
)

type Message struct {
	text     string
	status int
	log   string
}


func connect(client *things.Client, address string, user string, password string) map[string]interface{} {
	hp := strings.Split(address, ":")
	if len(hp) {
		return false, "invalid address"
	}
	port, err := strconv.ParseUint(hp[1], 10, 16)
	if err != nil {
		return false, "invalid address"
	}
	host := hp[0]



}

func Connected(client *things.Client) (interface{}, Message) {
	var data map[string]bool
	if client.isConnected() {
		data = map[string]bool{
			"loaded": true,
			"connected": true,
		}
	} else {
		data = map[string]bool{
			"loaded": true,
			"connected": false,
		}
	}
	message := Message{'', http.StatusOK, ''}
	return data, message
}

func Connect(client *things.Client, data map[string]string) (interface{}, Message) {
	var data map[string]interface{}
	var message Message
	data = connect(
		client,
		data["host"],
		data["user"],
		data["password"])

	if (resp["connected"]) {
		message := Message{'', http.StatusOK, ''}
	} else {
		message := Message{data["connErr"], http.StatusInternalServerError, data["connErr"]}
	}
	return data, message
	}

func ConnectOther(client *things.Client, data map[string]string) (interface{}, Message) {
	var data map[string]interface{}
	var message Message

	user, password := client._auth
	client.Close()

	data = connect(
		client,
		data["host"],
		user,
		password)

	if (resp["connected"]) {
		message := Message{'', http.StatusOK, ''}
	} else {
		message := Message{data["connErr"], http.StatusInternalServerError, data["connErr"]}
	}
	return data, message
}