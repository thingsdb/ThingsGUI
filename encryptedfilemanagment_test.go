package main

import (
	"fmt"
	"testing"
)

type LoginData struct {
	User     string `json:"user"`
	Password string `json:"password"`
}

func TestEncryptedfilemanagment(t *testing.T) {
	fmt.Println("TEST 4: encrypting file management")
	path := GetHomePath("things-gui_test")
	logCh := make(chan string, 1)
	go func() {
		for p := range logCh {
			fmt.Printf("%s", p)
		}
	}()

	mapping_in := map[string]LoginData{
		"John": LoginData{User: "John", Password: "pass1"},
		"Jane": LoginData{User: "Jane", Password: "pass2"},
		"Mary": LoginData{User: "Mary", Password: "pass3"},
	}

	mapping_out := make(map[string]LoginData)

	_, err := CreateFile(path, logCh)
	if err != nil {
		t.Errorf("Creating file FAILED: %s\n", err)
	}

	err = WriteEncryptedFile(path, mapping_in, logCh)
	if err != nil {
		t.Errorf("Writing file FAILED: %s\n", err)
	}

	err = ReadEncryptedFile(path, &mapping_out, logCh)
	if err != nil {
		t.Errorf("Reading encrypted file FAILED: %s\n", err)
	}

	if mapping_in["John"].Password == mapping_out["John"].Password {
		fmt.Println("TEST 4: SUCCESSFULL. Encrypting file management.")
	} else {
		t.Errorf("TEST 4: FAILED. Encrypting file management.\n")
	}

	fmt.Println("TEST 5: deleting file")
	err = DeleteFile(path, logCh)
	if err != nil {
		t.Errorf("Deleting encrypted file FAILED: %s\n", err)
	}

	if FileNotExist(path) {
		fmt.Printf("TEST 5: SUCCESSFULL. %s has been removed\n", path)
	} else {
		t.Errorf("TEST 5: Deleting encrypted file FAILED\n")
	}
}
