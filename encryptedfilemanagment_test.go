package main

import (
	"fmt"
	"testing"
)

type loginTest struct {
	User     string `json:"user"`
	Password string `json:"password"`
}

func TestEncryptedfilemanagment(t *testing.T) {
	path := getHomePath("things-gui_test")
	logCh := make(chan string, 1)
	go func() {
		for p := range logCh {
			fmt.Printf("%s", p)
		}
	}()

	mappingIn := map[string]loginTest{
		"John": loginTest{User: "John", Password: "pass1"},
		"Jane": loginTest{User: "Jane", Password: "pass2"},
		"Mary": loginTest{User: "Mary", Password: "pass3"},
	}

	mappingOut := make(map[string]loginTest)

	_, err := createFile(path, logCh)
	if err != nil {
		t.Errorf("Creating file FAILED: %s\n", err)
	}

	err = writeEncryptedFile(path, mappingIn, logCh)
	if err != nil {
		t.Errorf("Writing file FAILED: %s\n", err)
	}

	err = readEncryptedFile(path, &mappingOut, logCh)
	if err != nil {
		t.Errorf("Reading encrypted file FAILED: %s\n", err)
	}

	if mappingIn["John"].Password != mappingOut["John"].Password {
		t.Errorf("TEST 4: FAILED. Encrypting file management.\n")
	}

	err = deleteFile(path, logCh)
	if err != nil {
		t.Errorf("Deleting encrypted file FAILED: %s\n", err)
	}

	if !fileNotExist(path) {
		t.Errorf("TEST 5: Deleting encrypted file FAILED\n")
	}
}
