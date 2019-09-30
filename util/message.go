package util

import "net/http"

type Message struct {
	Text   string
	Status int
	Log    string
}

func Msg(err error, status int) Message {
	var message Message
	if err != nil {
		message = Message{Text: "Query error", Status: status, Log: err.Error()}
	} else {
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	}
	return message
}
