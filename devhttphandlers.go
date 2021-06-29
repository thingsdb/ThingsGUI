// +build debug

package main

import (
	"fmt"
	"net/http"
)

func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, fmt.Sprintf("./static/js/main-bundle-%s.js", AppVersion), "text/javascript")
}

func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, fmt.Sprintf("./static/js/vendors-bundle-%s.js", AppVersion), "text/javascript")
}

func handlerEditorWorkerJS(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/js/editor.worker.js", "text/javascript")
}

func handlerMonacoFontTTF(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/fonts/monaco-font.ttf", "font/ttf")
}

func handlerThingsdbGIF(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/thingsdb.gif", "image/gif")
}

func handlerThingsguiLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/thingsgui-logo.png", "image/png")
}

func handlerThingsdbLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/thingsdb-logo.png", "image/png")
}

func handlerBackgroundImg(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/backgroundImg.svg", "image/svg+xml")
}

func handlerGithubLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/githubLogo.svg", "image/svg+xml")
}

func handlerFacebookLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/facebookLogo.png", "image/png")
}

func handlerLinkedinLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/linkedinLogo.png", "image/png")
}

func handlerTTLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/TTLogo.png", "image/png")
}

func handlerViewEditLogo(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/img/view-edit.png", "image/png")
}

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./static/favicon.ico", "image/x-icon")
}

func handlerMain(w http.ResponseWriter, r *http.Request) {
	HandleFileRequest(w, "./templates/app.html", "text/html")
}
