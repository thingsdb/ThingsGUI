// +build debug

package main

import (
	"fmt"
	"net/http"

	util "./util"
)

func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, fmt.Sprintf("./static/js/main-bundle-%s.js", AppVersion), "text/javascript")
}
func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, fmt.Sprintf("./static/js/vendors-bundle-%s.js", AppVersion), "text/javascript")
}
func handlerThingsdbGIF(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/thingsdb.gif", "image/gif")
}
func handlerThingsdbLogo(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/thingsdb-logo.png", "image/png")
}
func handlerGithubLogo(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/githubLogo.svg", "image/svg+xml")
}
func handlerFacebookLogo(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/facebookLogo.png", "image/png")
}
func handlerLinkedinLogo(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/linkedinLogo.png", "image/png")
}
func handlerTTLogo(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/img/TTLogo.png", "image/png")
}
func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./static/favicon.ico", "image/x-icon")
}
func handlerMain(w http.ResponseWriter, r *http.Request) {
	util.HandleFileRequest(w, "./templates/app.html", "text/html")
}