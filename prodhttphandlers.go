// +build !debug

package main

import (
	"net/http"

	util "./util"
)

func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/javascript")
	w.Write(FileMainBundleMinJS)
}

func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/javascript")
	w.Write(FileVendorsBundleMinJS)
}

func handlerThingsdbGIF(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/gif")
	w.Write(FileThingsdbGIF)
}

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/x-icon")
	w.Write(FileFaviconICO)
}

func handlerMain(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		util.HandlerNotFound(w, r)
	} else {
		w.Header().Set("Content-Type", "text/html")
		w.Write(FileAppHTML)
	}
}
