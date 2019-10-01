package util

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func HandlerNotFound(w http.ResponseWriter, r *http.Request) {
	sendError(w, "404 not found", http.StatusNotFound)
}

func sendError(w http.ResponseWriter, err string, code int) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	http.Error(w, err, code)
}

func readJSON(w http.ResponseWriter, r *http.Request, v *interface{}) error {
	decoder := json.NewDecoder(r.Body)
	decoder.UseNumber()
	if err := decoder.Decode(v); err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return err
	}
	return nil
}

func readBody(w http.ResponseWriter, r *http.Request, v interface{}) error {
	contentType := r.Header.Get("Content-type")
	switch strings.ToLower(contentType) {
	case "application/json":
		return readJSON(w, r, &v)
	default:
		err := fmt.Errorf("unsupported content-type: %s", contentType)
		sendError(w, err.Error(), http.StatusUnsupportedMediaType)
		return err
	}
}

func HandleFileRequest(w http.ResponseWriter, fn, ct string) {
	b, err := ioutil.ReadFile(fn)
	if err == nil {
		w.Header().Set("Content-Type", ct)
		_, err = w.Write(b)
		if err != nil {
			sendError(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		sendError(w, err.Error(), http.StatusInternalServerError)
	}
}

func HandlerDownload(w http.ResponseWriter, r *http.Request) {
	var link string
	if err := readBody(w, r, &link); err != nil {
		sendError(w, err.Error(), http.StatusInternalServerError)
		return // error is send by the readBody function
	}
	res := strings.Split(link, "download")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", "attachment; filename="+fmt.Sprintf("%s", res[1]))
	w.Header().Set("Content-Transfer-Encoding", "binary")
	HandleFileRequest(w, fmt.Sprintf("%s", res[1]), "application/octet-stream")
}
