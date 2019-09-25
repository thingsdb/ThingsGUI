package handlers

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"unicode/utf8"

	util "../util"
	things "github.com/thingsdb/go/client"
)

type UniqueRand struct {
	generated map[int]bool
}

var uniq UniqueRand

func Init() {
	uniq = UniqueRand{}
}

func (u *UniqueRand) UniqueId() int {
	for {
		i := rand.Int()
		if !u.generated[i] {
			u.generated[i] = true
			return i
		}
	}
}

func typeChecking(thing *interface{}) {
	fmt.Println(*thing)
	fmt.Printf("%T\n", *thing)
	switch v := (*thing).(type) {
	case string:
		fmt.Println("HOOOOOOOOOOOOOOOOOOOOOOI1")
		fmt.Println(utf8.ValidString(v))
		if !utf8.ValidString(v) {
			fmt.Println("HOOOOOOOOOOOOOOOOOOOOOOI")
			var err error
			var hostname string
			guid := uniq.UniqueId()

			err = ioutil.WriteFile(fmt.Sprintf("/tmp/%d", guid), []byte(v), 0644)
			if err != nil {
				panic(err)
			}

			hostname, err = os.Hostname()
			if err != nil {
				panic(err)
			}
			*thing = fmt.Sprintf("http://%s/download/%d", hostname, guid)
		}
	case []interface{}:
		for i := 0; i < len(v); i++ {
			typeChecking(&v[i])
		}
	case map[string]interface{}:
		for _, i := range v {
			typeChecking(&i)
		}
	default:
		// no match; here v has the same type as i
	}
}

func Query(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, interface{}, util.Message) {
	resp, err := conn.Query(
		fmt.Sprintf("%s", data["scope"]),
		fmt.Sprintf("%s", data["query"]),
		nil,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	// typeChecking(&resp)
	return message.Status, resp, message
}

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

func QueryBlob(conn *things.Conn, data Data, timeout uint16) (int, interface{}, util.Message) {
	fmt.Println(data.Blob)

	decodedBlob, err := base64.StdEncoding.DecodeString(data.Blob)
	if err != nil {
		fmt.Println("error:", err)
		message := util.Msg(err, http.StatusInternalServerError)
		return message.Status, "", message
	}
	fmt.Println(string(decodedBlob))

	blob := map[string]interface{}{
		"blob": string(decodedBlob),
	}

	resp, err := conn.Query(
		fmt.Sprintf("%s", data.Scope),
		fmt.Sprintf("%s", data.Query),
		blob,
		timeout)
	message := util.Msg(err, http.StatusInternalServerError)
	return message.Status, resp, message
}

func QueryEditor(conn *things.Conn, data map[string]interface{}, timeout uint16) (int, map[string]interface{}, util.Message) {
	var collectionResp = make(map[string]interface{})
	resp1, err := conn.Query(
		fmt.Sprintf("%s", data["scope"]),
		fmt.Sprintf("%s", data["query"]),
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
