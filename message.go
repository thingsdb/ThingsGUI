package main

import "net/http"

// message type
type message struct {
	Text   string
	Status int
	Log    string
}

// msg returns an error message if error is not nil
func msg(err error) message {
	if err == nil {
		return successMsg()
	} else {
		return failedMsg(err)
	}
}

// successMsg returns OK
func successMsg() message {
	return message{
		Text:   "",
		Status: http.StatusOK,
		Log:    "",
	}
}

// failedMsg returns InternalError
func failedMsg(err error) message {
	return message{
		Text:   "Query error",
		Status: http.StatusInternalServerError,
		Log:    err.Error(),
	}
}
