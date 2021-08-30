package main

import (
	"net/http"
	"testing"
	"time"
)

var testCookie = "testCookie"
var testKeySession = "testKey"
var testAddress = "testAddress"
var testMaxAge = 10

func addSessionTest(t *testing.T) {
	cookie := &http.Cookie{
		Name:   testCookie,
		Value:  testKeySession,
		MaxAge: testMaxAge, // seconds
	}
	data := loginData{
		Address: testAddress,
	}

	addSession(*cookie, data, testMaxAge)
	login := getSession(testKeySession)

	if login == nil {
		t.Errorf("TEST: session FAILED: getSession returned nil.\n")
	} else if login.Address != testAddress {
		t.Errorf("Encrypting FAILED: getSession returned wrong value\n")
	}
}

func TestSessions(t *testing.T) {
	newSessions()
	addSessionTest(t)
	resetSession(testKeySession)
	login := getSession(testKeySession)
	if login != nil {
		t.Errorf("TEST: session FAILED: getSession should return nil after resetSession.\n")
	}

	addSessionTest(t)
	time.Sleep(time.Duration(testMaxAge) * time.Second)
	login = getSession(testKeySession)
	if login != nil {
		t.Errorf("TEST: session FAILED: getSession should return nil after max expiration time.\n")
	}
}
