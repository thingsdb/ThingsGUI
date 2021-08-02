package main

import (
	"fmt"

	things "github.com/thingsdb/go-thingsdb"
)

// ErrorType used for type assertion
type ErrorType interface {
	Error() string
	Code() things.ErrorCode
}

// CreateThingsDBError asserts default error to custom error and return a Message type
func CreateThingsDBError(err error) Message {
	errT, ok := err.(ErrorType)
	if !ok {
		message := FailedMsg(fmt.Errorf("Wrong Error type"))
		return message
	}
	return FailedMsg(fmt.Errorf("(%d) %s", errT.Code(), errT.Error()))
}
