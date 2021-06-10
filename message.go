package main

import "net/http"

// Message type
type Message struct {
	Text   string
	Status int
	Log    string
}

// Msg returns an error message if error is not nil
func Msg(err error, status int) Message {
	var message Message
	if err != nil {
		message = Message{Text: "Query error", Status: status, Log: err.Error()}
	} else {
		message = Message{Text: "", Status: http.StatusOK, Log: ""}
	}
	return message
}
