package main

import (
	"fmt"

	things "github.com/thingsdb/go-thingsdb"
)

// errorType used for type assertion
type errorType interface {
	error() string
	code() things.ErrorCode
}

// createThingsDBError asserts default error to custom error and return a Message type
func createThingsDBError(err error) message {
	errT, ok := err.(errorType)
	if !ok {
		message := failedMsg(fmt.Errorf("Wrong Error type"))
		return message
	}
	return failedMsg(fmt.Errorf("(%d) %s", errT.code(), errT.error()))
}
