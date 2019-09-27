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

func Query(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	resp, err := conn.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	util.ReplaceBinStrWithLink(resp) // run as goroutine??
	return message.Status, resp, message
}

func QueryBlob(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	decodedBlob, err := base64.StdEncoding.DecodeString(data.Blob)
	if err != nil {
		fmt.Println("error:", err)
		message := util.Msg(err, http.StatusInternalServerError)
		return message.Status, "", message
	}

	blob := map[string]interface{}{
		"blob": string(decodedBlob),
	}

	resp, err := conn.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		blob,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	util.ReplaceBinStrWithLink(resp)
	return message.Status, resp, message
}

func QueryEditor(conn *things.Conn, data Data, timeout uint16) (int, map[string]interface{}, util.Message) {
	var collectionResp = make(map[string]interface{})
	resp1, err := conn.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	util.ReplaceBinStrWithLink(resp1)
	collectionResp["output"] = resp1

	if err == nil && strings.Contains(data.Scope, "@collection") {
		resp2, err := conn.Query(
			fmt.Sprintf("%s", data.Scope),
			"thing(.id());",
			nil,
			timeout)
		message = util.Msg(err, http.StatusInternalServerError)
		util.ReplaceBinStrWithLink(resp2)
		collectionResp["things"] = resp2
	}
	return message.Status, collectionResp, message
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
