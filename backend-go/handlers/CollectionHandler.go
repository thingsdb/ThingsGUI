package handlers

import (
	"fmt"
	"net/http"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

func Query(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, interface{}, util.Message) {
	resp, err := conn.Query(
		fmt.Sprintf("%s", data["scope"]),
		fmt.Sprintf("%s", data["query"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

func QueryEditor(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, map[string]interface{}, util.Message) {
	var collectionResp = make(map[string]interface{})
	resp1, err := conn.Query(
		fmt.Sprintf("%s", data["scope"]),
		fmt.Sprintf("%s;", data["query"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	collectionResp["output"] = resp1

	if s, ok := data["scope"].(string); err == nil && ok && strings.Contains(s, "@collection") {
		resp2, err := conn.Query(
			fmt.Sprintf("%s", data["scope"]),
			"thing(.id());",
			nil,
			timeout)
		message = util.Msg(err, http.StatusInternalServerError)
		collectionResp["things"] = resp2
	}
	return message.Status, collectionResp, message
}
