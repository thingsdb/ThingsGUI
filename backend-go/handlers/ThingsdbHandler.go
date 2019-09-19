package handlers

import (
	"fmt"
	"net/http"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type ThingsdbResp struct {
	Collections interface{}
	Collection  interface{}
	Users       interface{}
	User        interface{}
}

func GetDbinfo(sid string, conn *map[string]*things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query(
		"@thingsdb",
		"{collections: collections_info(), users: users_info(), user: user_info()}",
		nil,
		timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}

	m, ok := resp.(map[string]interface{})
	if ok {
		thingsdbResp.Collections = m["collections"]
		thingsdbResp.Users = m["users"]
		thingsdbResp.User = m["user"]
	} else {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
	}

	return message.Status, thingsdbResp, message
}

func GetCollections(sid string, conn *map[string]*things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query("@thingsdb", "collections_info()", nil, timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}
	thingsdbResp.Collections = resp
	return message.Status, thingsdbResp, message
}

func GetCollection(sid string, conn *map[string]*things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query("@thingsdb", "collection_info()", nil, timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}
	thingsdbResp.Collection = resp

	return message.Status, thingsdbResp, message
}

func NewCollection(sid string, conn *map[string]*things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query(
		"@thingsdb",
		fmt.Sprintf("new_collection('%s'); {collections: collections_info(), users: users_info()}",
			data["name"],
		),
		nil,
		timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}

	m, ok := resp.(map[string]interface{})
	if ok {
		thingsdbResp.Collections = m["collections"]
		thingsdbResp.Users = m["users"]
	} else {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
	}

	return message.Status, thingsdbResp, message
}

func DelCollection(sid string, conn *map[string]*things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query(
		"@thingsdb",
		fmt.Sprintf("del_collection('%s'); {collections: collections_info(), users: users_info()}",
			data["name"],
		),
		nil,
		timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}

	m, ok := resp.(map[string]interface{})
	if ok {
		thingsdbResp.Collections = m["collections"]
		thingsdbResp.Users = m["users"]
	} else {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
	}

	return message.Status, thingsdbResp, message
}

func RenameCollection(sid string, conn *map[string]*things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query(
		"@thingsdb",
		fmt.Sprintf("rename_collection('%s', '%s'); {collections: collections_info(), users: users_info()}",
			data["oldname"],
			data["newname"],
		),
		nil,
		timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}

	m, ok := resp.(map[string]interface{})
	if ok {
		thingsdbResp.Collections = m["collections"]
		thingsdbResp.Users = m["users"]
	} else {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
	}

	return message.Status, thingsdbResp, message
}

func SetQuota(sid string, conn *map[string]*things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	var message util.Message
	resp, err := (*conn)[sid].Query(
		"@thingsdb",
		fmt.Sprintf("set_quota('%s', '%s', %s); collections_info()",
			data["name"],
			data["quotaType"],
			data["quota"],
		),
		nil,
		timeout)
	if err != nil {
		message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: err.Error()}
	} else {
		message = util.Message{Text: "", Status: http.StatusOK, Log: ""}
	}
	thingsdbResp.Collections = resp
	return message.Status, thingsdbResp, message
}
