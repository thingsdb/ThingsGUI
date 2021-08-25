// +build !debug

package main

import (
	"net/http"
)

func handlerMainJsBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/javascript")
	w.Write(FileMainBundleMinJS)
}

func handlerVendorsJsBundle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/javascript")
	w.Write(FileVendorsBundleMinJS)
}

func handlerEditorWorkerJS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/javascript")
	w.Write(FileEditorWorkerJS)
}

func handlerMonacoFontTTF(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "font/ttf")
	w.Write(FileMonacoFontTTF)
}

func handlerThingsdbGIF(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/gif")
	w.Write(FileThingsdbGIF)
}

func handlerThingsguiLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileThingsguiLogo)
}

func handlerThingsdbLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileThingsdbLogo)
}

func handlerGithubLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/svg+xml")
	w.Write(FileGithubLogo)
}

func handlerFacebookLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileFacebookLogo)
}

func handlerLinkedinLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileLinkedinLogo)
}

func handlerTTLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileTTLogo)
}

func handlerViewEditLogo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/png")
	w.Write(FileViewEditLogo)
}

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "image/x-icon")
	w.Write(FileFaviconICO)
}

func handlerMain(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		handlerNotFound(w, r)
	} else {
		w.Header().Set("Content-Type", "text/html")
		w.Write(FileAppHTML)
	}
}
