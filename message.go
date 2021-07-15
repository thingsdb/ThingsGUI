package main

import "net/http"

// Message type
type Message struct {
	Text   string
	Status int
	Log    string
}

// Msg returns an error message if error is not nil
func Msg(err error) Message {
	if err == nil {
		return SuccessMsg()
	} else {
		return FailedMsg(err)
	}
}

// Msg returns an error message if error is not nil
func SuccessMsg() Message {
	return Message{
		Text:   "",
		Status: http.StatusOK,
		Log:    "",
	}
}

// Msg returns an error message if error is not nil
func FailedMsg(err error) Message {
	return Message{
		Text:   "Query error",
		Status: http.StatusInternalServerError,
		Log:    err.Error(),
	}
}
