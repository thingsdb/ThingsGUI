package main

import (
	"fmt"
	"net/http"

	thingsdb "github.com/thingsdb/go-thingsdb"
)

// ErrorType used for type assertion
type ErrorType interface {
	Error() string
	Code() thingsdb.ErrorCode
}

// CreateThingsDBError asserts default error to custom error and return a Message type
func CreateThingsDBError(err error) Message {
	errT, ok := err.(ErrorType)
	if !ok {
		message := Message{Text: "Query error", Status: http.StatusInternalServerError, Log: "Expected Error type"}
		return message
	}
	return Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("(%d) %s", errT.Code(), errT.Error())}
}
