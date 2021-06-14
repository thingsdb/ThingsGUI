package main

import (
	"fmt"
	"testing"
)

// var key = []byte("eofnt846dtrwphgnv587f6sw73jr9fhf")

func TestEncryptDecrypt(t *testing.T) {
	fmt.Println("TEST 6: encrypting and decrypting data")
	encrypted, err := Encrypt([]byte("testing_this_string"), key)
	if err != nil {
		t.Errorf("Encrypting FAILED: %s\n", err)
	}

	plaintext, err := Decrypt(encrypted, key)
	if err != nil {
		t.Errorf("Decrypting FAILED: %s\n", err)
	}

	if string(plaintext) == "testing_this_string" {
		fmt.Printf("TEST 6: Encrypting and decrypting data SUCCESSFULL.\n")
	} else {
		t.Errorf("TEST 6: Encrypting and decrypting data FAILED.\n")
	}

}
