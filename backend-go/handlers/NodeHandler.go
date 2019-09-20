package handlers

import (
	"fmt"
	"net/http"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type NodeResp struct {
	Nodes    interface{}
	Node     interface{}
	Counters interface{}
}

// func otherNode() {
// WHY NEEDED?
// }

func GetNodes(conn *things.Conn, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		"nodes_info();",
		nil, timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Nodes = resp
	return message.Status, nodeResp, message
}

func GetNode(conn *things.Conn, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		"{counters: counters(), node: node_info()};",
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	if err == nil {
		m, ok := resp.(map[string]interface{})
		if ok {
			nodeResp.Counters = m["counters"]
			nodeResp.Node = m["node"]
		} else {
			message = util.Message{Text: "Query error", Status: http.StatusInternalServerError, Log: fmt.Sprintf("Unexpected return type: %T", resp)}
		}
	}
	return message.Status, nodeResp, message
}

func ResetCounters(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		"reset_counters(); counters();",
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Counters = resp
	return message.Status, nodeResp, message
}

func SetLoglevel(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		fmt.Sprintf("set_log_level(%s); node_info();", data["level"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Node = resp
	return message.Status, nodeResp, message
}

func Shutdown(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		"shutdown(); node_info();",
		nil,
		timeout)

	//CLOSE CLIENT?
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Node = resp
	return message.Status, nodeResp, message
}

func NewNode(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	fmt.Println("TODO")
	fmt.Println(data)
	var nodeResp NodeResp
	var q string
	if data["port"] != nil {
		q = fmt.Sprintf(
			"new_node('%s', '%s', %s); nodes_info();",
			data["secret"],
			data["address"],
			data["port"])
	} else {
		q = fmt.Sprintf(
			"new_node('%s', '%s'); nodes_info();",
			data["secret"],
			data["address"])
	}
	resp, err := conn.Query(
		"@node",
		q,
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Nodes = resp
	return message.Status, nodeResp, message
}

func PopNode(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	var nodeResp NodeResp
	resp, err := conn.Query(
		"@node",
		"pop_node(); nodes_info();",
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Nodes = resp
	return message.Status, nodeResp, message
}

func ReplaceNode(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, NodeResp, util.Message) {
	fmt.Println("TODO")
	fmt.Println(data)
	var nodeResp NodeResp
	var q string
	if data["port"] != nil {
		q = fmt.Sprintf(
			"replace_node(%s, '%s', '%s', %s); nodes_info();",
			data["nodeId"],
			data["secret"],
			data["address"],
			data["port"])
	} else {
		q = fmt.Sprintf(
			"replace_node(%s, '%s', '%s'); nodes_info();",
			data["nodeId"],
			data["secret"],
			data["address"])
	}
	resp, err := conn.Query(
		"@node",
		q,
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	nodeResp.Nodes = resp
	return message.Status, nodeResp, message
}
