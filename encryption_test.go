package main

import (
	"testing"
)

var testKey = []byte("eofnt846dtrwphgnv587f6sw73jr9fhf")

func TestEncryptDecrypt(t *testing.T) {
	encrypted, err := encrypt([]byte("testing_this_string"), testKey)
	if err != nil {
		t.Errorf("Encrypting FAILED: %s\n", err)
	}

	plaintext, err := decrypt(encrypted, testKey)
	if err != nil {
		t.Errorf("Decrypting FAILED: %s\n", err)
	}

	if string(plaintext) != "testing_this_string" {
		t.Errorf("TEST 6: Encrypting and decrypting data FAILED.\n")
	}

}
