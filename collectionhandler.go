package main

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type Procedure struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

// Data struct that received
type Data struct {
	Query     string                 `json:"query"`
	Scope     string                 `json:"scope"`
	Blob      map[string]string      `json:"blob"`
	Ids       []string               `json:"ids"`
	Arguments map[string]interface{} `json:"arguments"`
	Procedure Procedure              `json:"procedure"`
}

// Query sends a query to ThingsDB and receives a result
func Query(client *Client, data Data, timeout uint16) (int, interface{}, Message) {
	for k, v := range data.Blob {
		decodedBlob, err := base64.StdEncoding.DecodeString(v)
		if err != nil {
			message := Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
			return message.Status, "", message
		}

		if data.Arguments == nil {
			data.Arguments = make(map[string]interface{})
		}
		data.Arguments[k] = decodedBlob
	}

	resp, err := client.Connection.Query(
		data.Scope,
		data.Query,
		data.Arguments,
		timeout)

	if err != nil {
		message := CreateThingsDBError(err)
		return message.Status, "", message
	}

	var r interface{}
	r, err = client.TmpFiles.ReplaceBinStrWithLink(resp)
	message := Msg(err, http.StatusInternalServerError)
	if r != nil {
		resp = r
	}
	return message.Status, resp, message
}

// CleanupTmp removes downloaded blob objects from the local tmp folder
func CleanupTmp(tmp *TmpFiles) (int, bool, Message) {
	resp := true
	err := tmp.CleanupTmp()
	message := Msg(err, http.StatusInternalServerError)
	if err != nil {
		resp = false
	}
	return message.Status, resp, message
}

// Watch things that correspond to the provided IDs
func Watch(client *Client, data Data, timeout uint16) (int, interface{}, Message) {
	scope := data.Scope
	ids := data.Ids
	idsInt := make([]uint64, 0)

	if len(ids) > 0 {
		for _, v := range ids {
			id, _ := strconv.ParseUint(v, 10, 64)
			idsInt = append(idsInt, id)
		}
	}

	resp, err := client.Connection.Watch(scope, idsInt, timeout)
	message := Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

// Unwatch things that correspond to the provided IDs
func Unwatch(client *Client, data Data, timeout uint16) (int, interface{}, Message) {
	scope := data.Scope
	ids := data.Ids
	idsInt := make([]uint64, 0)

	if len(ids) > 0 {
		for _, v := range ids {
			id, _ := strconv.ParseUint(v, 10, 64)
			idsInt = append(idsInt, id)
		}
	}

	resp, err := client.Connection.Unwatch(scope, idsInt, timeout)
	message := Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

// Run the procedure that is provided
func Run(client *Client, data Data, timeout uint16) (int, interface{}, Message) {
	var args interface{}
	message := Message{Text: "", Status: http.StatusOK, Log: ""}
	if data.Procedure.Name != "" {
		decoder := json.NewDecoder(strings.NewReader(data.Procedure.Arguments))
		if err := decoder.Decode(&args); err != nil {
			message = Msg(err, http.StatusInternalServerError)
			return message.Status, "", message
		}
		args = Convert(args)
	}

	resp, err := client.Connection.Run(data.Procedure.Name, args, data.Scope, timeout)
	if err != nil {
		message = CreateThingsDBError(err)
	}
	return message.Status, resp, message
}
