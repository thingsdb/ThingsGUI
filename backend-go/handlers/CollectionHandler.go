package handlers

import (
	"fmt"
	"net/http"
	"strings"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type CollectionResp struct {
	Output interface{}
	Things interface{}
}

func QueryThing(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, CollectionResp, util.Message) {
	var collectionResp CollectionResp
	var q string
	if data["thingId"] != nil {
		// q = fmt.Sprintf("return(#%s, %d);", data["thingId"], data["depth"])
		q = fmt.Sprintf("return(#%d);", data["thingId"])
	} else {
		// q = fmt.Sprintf("return(thing(.id()), %d);", data["depth"])
		q = "return(thing(.id()));"
	}
	fmt.Println(q, data)
	resp, err := conn.Query(
		fmt.Sprintf("@collection:%s", data["collectionName"]),
		q,
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	collectionResp.Things = resp
	return message.Status, collectionResp, message
}

func QueryRaw(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, CollectionResp, util.Message) {
	var collectionResp CollectionResp
	resp, err := conn.Query(
		fmt.Sprintf("@collection:%s", data["collectionName"]),
		fmt.Sprintf("%s #%d;", data["query"], data["thingId"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	collectionResp.Things = resp
	return message.Status, collectionResp, message
}

func QueryEditor(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, CollectionResp, util.Message) {
	var collectionResp CollectionResp
	resp1, err := conn.Query(
		fmt.Sprintf("%s", data["scope"]),
		fmt.Sprintf("%s;", data["query"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	collectionResp.Output = resp1

	if s, ok := data["scope"].(string); err == nil && ok && strings.Contains(s, "@collection") {
		resp2, err := conn.Query(
			fmt.Sprintf("%s", data["scope"]),
			"thing(.id());",
			nil,
			timeout)
		message = util.Msg(err, http.StatusInternalServerError)
		collectionResp.Things = resp2
	}
	return message.Status, collectionResp, message
}
