package main

import (
	"fmt"
	"testing"
)

type userData struct {
	user     string `json:"user"`
	password string `json:"password"`
}

func TestEncryptedfilemanagment(t *testing.T) {
	fmt.Println("TEST 4: encrypting file management")
	path := getHomePath("things-gui_test")
	logCh := make(chan string, 1)
	go func() {
		for p := range logCh {
			fmt.Printf("%s", p)
		}
	}()

	mapping_in := map[string]loginData{
		"John": loginData{user: "John", password: "pass1"},
		"Jane": loginData{user: "Jane", password: "pass2"},
		"Mary": loginData{user: "Mary", password: "pass3"},
	}

	mapping_out := make(map[string]loginData)

	_, err := createFile(path, logCh)
	if err != nil {
		t.Errorf("Creating file FAILED: %s\n", err)
	}

	err = writeEncryptedFile(path, mapping_in, logCh)
	if err != nil {
		t.Errorf("Writing file FAILED: %s\n", err)
	}

	err = readEncryptedFile(path, &mapping_out, logCh)
	if err != nil {
		t.Errorf("Reading encrypted file FAILED: %s\n", err)
	}

	if mapping_in["John"].password == mapping_out["John"].password {
		fmt.Println("TEST 4: SUCCESSFULL. Encrypting file management.")
	} else {
		t.Errorf("TEST 4: FAILED. Encrypting file management.\n")
	}

	fmt.Println("TEST 5: deleting file")
	err = deleteFile(path, logCh)
	if err != nil {
		t.Errorf("Deleting encrypted file FAILED: %s\n", err)
	}

	if fileNotExist(path) {
		fmt.Printf("TEST 5: SUCCESSFULL. %s has been removed\n", path)
	} else {
		t.Errorf("TEST 5: Deleting encrypted file FAILED\n")
	}
}
