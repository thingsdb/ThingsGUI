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

func GetDbinfo(conn *things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		"{collections: collections_info(), users: users_info(), user: user_info()};",
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	if err == nil {
		m, ok := resp.(map[string]interface{})
		if ok {
			thingsdbResp.Collections = m["collections"]
			thingsdbResp.Users = m["users"]
			thingsdbResp.User = m["user"]
		} else {
			message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
		}
	}
	return message.Status, thingsdbResp, message
}

func GetCollections(conn *things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query("@thingsdb", "collections_info();", nil, timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Collections = resp
	return message.Status, thingsdbResp, message
}

func GetCollection(conn *things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query("@thingsdb", "collection_info();", nil, timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Collection = resp
	return message.Status, thingsdbResp, message
}

func NewCollection(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("new_collection('%s'); {collections: collections_info(), users: users_info()};",
			data["name"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	if err == nil {
		m, ok := resp.(map[string]interface{})
		if ok {
			thingsdbResp.Collections = m["collections"]
			thingsdbResp.Users = m["users"]
		} else {
			message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
		}
	}
	return message.Status, thingsdbResp, message
}

func DelCollection(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("del_collection('%s'); {collections: collections_info(), users: users_info()};",
			data["name"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	if err == nil {
		m, ok := resp.(map[string]interface{})
		if ok {
			thingsdbResp.Collections = m["collections"]
			thingsdbResp.Users = m["users"]
		} else {
			message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
		}
	}
	return message.Status, thingsdbResp, message
}

func RenameCollection(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("rename_collection('%s', '%s'); {collections: collections_info(), users: users_info()};",
			data["oldname"],
			data["newname"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	if err == nil {
		m, ok := resp.(map[string]interface{})
		if ok {
			thingsdbResp.Collections = m["collections"]
			thingsdbResp.Users = m["users"]
		} else {
			message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
		}
	}
	return message.Status, thingsdbResp, message
}

func SetQuota(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("set_quota('%s', '%s', %s); collections_info();",
			data["name"],
			data["quotaType"],
			data["quota"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Collections = resp
	return message.Status, thingsdbResp, message
}

func GetUsers(conn *things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query("@thingsdb", "users_info();", nil, timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func GetUser(conn *things.Conn, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query("@thingsdb", "user_info();", nil, timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.User = resp
	return message.Status, thingsdbResp, message
}

func NewUser(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("new_user('%s'); users_info();",
			data["name"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func DelUser(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("del_user('%s'); users_info();",
			data["name"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func RenameUser(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("rename_user('%s', '%s'); users_info();",
			data["oldname"],
			data["newname"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func SetPassword(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("set_password('%s', '%s'); users_info();",
			data["name"],
			data["password"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func ResetPassword(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("set_password('%s', nil); users_info();",
			data["name"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func Grant(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("grant('%s', '%s', %s); users_info();",
			data["collection"],
			data["name"],
			data["access"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func Revoke(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("revoke('%s', '%s', %s); users_info();",
			data["collection"],
			data["name"],
			data["access"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func NewToken(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	fmt.Println("TODO")
	fmt.Println(data)
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("new_token('%s', %s, '%s'); users_info();",
			data["name"],
			data["expirationTime"],
			data["description"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func DelToken(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		fmt.Sprintf("del_token('%s'); users_info();",
			data["key"],
		),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}

func DelExpired(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, ThingsdbResp, util.Message) {
	var thingsdbResp ThingsdbResp
	resp, err := conn.Query(
		"@thingsdb",
		"del_expired(); users_info();",
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	thingsdbResp.Users = resp
	return message.Status, thingsdbResp, message
}
