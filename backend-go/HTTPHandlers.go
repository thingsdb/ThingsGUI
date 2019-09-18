package app

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func handleFileRequest(w http.ResponseWriter, fn, ct string) {
	b, err := ioutil.ReadFile(fn)
	if err == nil {
		w.Header().Set("Content-Type", ct)
		_, err = w.Write(b)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		_, err = fmt.Fprintf(w, "Internal server error: %s", err)
	}
	if err != nil {
		fmt.Println(err)
	}
}
func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, fmt.Sprintf("./static/js/main-bundle-%s.js", AppVersion), "text/javascript")
}
func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, fmt.Sprintf("./static/js/vendors-bundle-%s.js", AppVersion), "text/javascript")
}
func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./static/favicon.ico", "image/x-icon")
}
func handlerMain(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./templates/go/app.html", "text/html")
}
