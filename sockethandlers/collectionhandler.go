package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	util "../util"
)

// Data struct that received
type Data struct {
	Query       string            `json:"query"`
	Scope       string            `json:"scope"`
	Blob        map[string]string `json:"blob"`
	Ids         []string          `json:"ids"`
	Args        string            `json:"args"`
	Procedure   string            `json:"procedure"`
	ConvertArgs bool              `json:"convertArgs"`
	EnableInts  bool              `json:"enableInts"`
}

func query(client *Client, data Data, blob map[string]interface{}, timeout uint16) (int, interface{}, util.Message) {
	resp, err := client.Connection.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		blob,
		timeout)

	if err != nil {
		message := util.CreateThingsDBError(err)
		return message.Status, "", message
	}

	var r interface{}
	r, err = client.TmpFiles.ReplaceBinStrWithLink(resp)
	message := util.Msg(err, http.StatusInternalServerError)
	if r != nil {
		resp = r
	}
	return message.Status, resp, message
}

// Query sends a query to ThingsDB and receives a result
func Query(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	return query(client, data, nil, timeout)
}

// QueryBlob sends a query with binary data
func QueryBlob(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	blob := make(map[string]interface{})
	for k, v := range data.Blob {
		decodedBlob, err := base64.StdEncoding.DecodeString(v)
		if err != nil {
			message := util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
			return message.Status, "", message
		}
		blob[k] = decodedBlob
	}
	return query(client, data, blob, timeout)
}

// CleanupTmp removes downloaded blob objects from the local tmp folder
func CleanupTmp(tmp *util.TmpFiles) (int, bool, util.Message) {
	resp := true
	err := tmp.CleanupTmp()
	message := util.Msg(err, http.StatusInternalServerError)
	if err != nil {
		resp = false
	}
	return message.Status, resp, message
}

// Watch things that correspond to the provided IDs
func Watch(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
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
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

// Unwatch things that correspond to the provided IDs
func Unwatch(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
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
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

// Run the procedure that is provided
func Run(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	var args interface{}
	message := util.Message{Text: "", Status: http.StatusOK, Log: ""}
	if data.Args != "" {
		decoder := json.NewDecoder(strings.NewReader(data.Args))
		if err := decoder.Decode(&args); err != nil {
			message = util.Msg(err, http.StatusInternalServerError)
			return message.Status, "", message
		}
		args = util.Convert(args)
	}
	resp, err := client.Connection.Run(data.Procedure, args, data.Scope, timeout)
	if err != nil {
		message = util.CreateThingsDBError(err)
	}
	return message.Status, resp, message
}
