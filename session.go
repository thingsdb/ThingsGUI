package main

import (
	"net/http"
	"sync"
	"time"
)

type session struct {
	cookie      http.Cookie
	data        loginData
	maxLifetime time.Time
}

type sessions struct {
	sessionData map[string]session
	mu          sync.Mutex
}

var globalSessions *sessions

func newSessions() {
	globalSessions = &sessions{
		sessionData: make(map[string]session),
	}

	// GC
	go func() {
		for now := range time.Tick(time.Second) {
			globalSessions.mu.Lock()
			for key, session := range globalSessions.sessionData {
				if now.UTC().After(session.maxLifetime) {
					delete(globalSessions.sessionData, key)
				}
			}
			globalSessions.mu.Unlock()
		}
	}()
}

func addSession(cookie http.Cookie, data loginData, maxAge int) {
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	globalSessions.sessionData[cookie.Value] = session{
		cookie:      cookie,
		data:        data,
		maxLifetime: time.Now().UTC().Add(time.Duration(maxAge) * time.Second),
	}

}

func getSession(key string) *loginData {
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	if session, ok := globalSessions.sessionData[key]; ok {
		return &session.data
	}

	return nil
}

func resetSession(key string) {
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	if _, ok := globalSessions.sessionData[key]; ok {
		delete(globalSessions.sessionData, key)
	}
}
