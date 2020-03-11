package handlers

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	util "../util"
)

type Data struct {
	Query       string            `json:"query"`
	Scope       string            `json:"scope"`
	Blob        map[string]string `json:"blob"`
	Ids         []string          `json:"ids"`
	Args        interface{}       `json:"args"`
	Procedure   string            `json:"procedure"`
	ConvertArgs bool              `json:convertArgs`
}

func query(client *Client, data Data, blob map[string]interface{}, timeout uint16) (int, interface{}, util.Message) {
	resp, err := client.Connection.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		blob,
		timeout)
	if err != nil {
		message := util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
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

func Query(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	return query(client, data, nil, timeout)
}

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

func QueryEditor(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	var collectionResp = make(map[string]interface{})

	status1, resp1, message1 := query(client, data, nil, timeout)
	if status1 == http.StatusInternalServerError {
		return status1, resp1, message1
	}
	collectionResp["output"] = resp1

	if strings.Contains(data.Scope, "@collection") {
		data.Query = "thing(.id());"
		status2, resp2, message2 := query(client, data, nil, timeout)
		if status2 == http.StatusInternalServerError {
			return status2, resp2, message2
		}
		collectionResp["things"] = resp2
	}
	return message1.Status, collectionResp, message1
}

func CleanupTmp(tmp *util.TmpFiles) (int, bool, util.Message) {
	resp := true
	err := tmp.CleanupTmp()
	message := util.Msg(err, http.StatusInternalServerError)
	if err != nil {
		resp = false
	}
	return message.Status, resp, message
}

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

func Run(client *Client, data Data, timeout uint16) (int, interface{}, util.Message) {
	resp, err := client.Connection.Run(data.Procedure, data.Args, data.Scope, timeout, data.ConvertArgs)
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}
