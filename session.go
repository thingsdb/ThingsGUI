package main

import (
	"fmt"
	"net/http"
	"sync"
	"time"
)

type session struct {
	cookie      http.Cookie
	data        LoginData
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
					fmt.Println("DELETE", session.maxLifetime, now.UTC())
					delete(globalSessions.sessionData, key)
				}
			}
			globalSessions.mu.Unlock()
		}
	}()
}

func addSession(cookie http.Cookie, data LoginData) {
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	globalSessions.sessionData[cookie.Value] = session{
		cookie:      cookie,
		data:        data,
		maxLifetime: time.Now().UTC().Add(time.Duration(cookieMaxAge) * time.Second),
	}

}

func getSession(key string) *LoginData {
	fmt.Println("KEY:\n", key, "\n", "SESSIONS KEYS:\n")
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	for k, _ := range globalSessions.sessionData {
		fmt.Println(k, "\n")
	}

	if session, ok := globalSessions.sessionData[key]; ok {
		fmt.Println("GET")
		return &session.data
	}

	return nil
}

func resetSession(key string) {
	globalSessions.mu.Lock()
	defer globalSessions.mu.Unlock()

	// reset
}
