// +build debug

package main

import (
	"fmt"
	"net/http"
)

func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, fmt.Sprintf("./react/static/js/main-bundle-%s.js", AppVersion), "text/javascript")
}

func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, fmt.Sprintf("./react/static/js/vendors-bundle-%s.js", AppVersion), "text/javascript")
}

func handlerEditorWorkerJS(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/js/editor.worker.js", "text/javascript")
}

func handlerMonacoFontTTF(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/fonts/monaco-font.ttf", "font/ttf")
}

func handlerThingsdbGIF(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/img/thingsdb.gif", "image/gif")
}

func handlerThingsguiLogo(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/img/thingsgui-logo.png", "image/png")
}

func handlerThingsdbLogo(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/img/thingsdb-logo.png", "image/png")
}

func handlerCesbitLogo(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/img/CesbitLogo.png", "image/png")
}

func handlerViewEditLogo(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/img/view-edit.png", "image/png")
}

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/static/favicon.ico", "image/x-icon")
}

func handlerMain(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./react/templates/app.html", "text/html")
}
