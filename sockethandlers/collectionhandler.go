package handlers

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

// type Data struct {
// 	Query string  `json:"query"`
// 	Scope string  `json:"scope"`
// 	Blob  []uint8 `json:"blob"`
// }

type Data struct {
	Query string
	Scope string
	Blob  string
}

func query(conn *things.Conn, data Data, blob map[string]interface{}, timeout uint16) (int, interface{}, util.Message) {
	resp, err := conn.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		blob,
		timeout)
	if err != nil {
		message := util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
		return message.Status, "", message
	}
	err = util.ReplaceBinStrWithLink(resp) // run as goroutine??
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

func Query(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	return query(conn, data, nil, timeout)
}

func QueryBlob(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	decodedBlob, err := base64.StdEncoding.DecodeString(data.Blob)
	if err != nil {
		message := util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
		return message.Status, "", message
	}

	blob := map[string]interface{}{
		"blob": string(decodedBlob),
	}

	return query(conn, data, blob, timeout)
}

func QueryEditor(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	var collectionResp = make(map[string]interface{})

	status1, resp1, message1 := query(conn, data, nil, timeout)
	if status1 == http.StatusInternalServerError {
		return status1, resp1, message1
	}
	collectionResp["output"] = resp1

	if strings.Contains(data.Scope, "@collection") {
		data.Query = "thing(.id());"
		status2, resp2, message2 := query(conn, data, nil, timeout)
		if status2 == http.StatusInternalServerError {
			return status2, resp2, message2
		}
		collectionResp["things"] = resp2
	}
	return message1.Status, collectionResp, message1
}

func CleanupTmp() (int, bool, util.Message) {
	resp := true
	err := util.CleanupTmp()
	message := util.Msg(err, http.StatusInternalServerError)
	if err != nil {
		resp = false
	}
	return message.Status, resp, message
}
