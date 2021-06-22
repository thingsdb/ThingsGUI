package main

import (
	"crypto/rand"
	"encoding/json"
)

var key []byte

func generateKey() error {
	if key == nil {
		key = make([]byte, 32) //generate a random 32 byte key for AES-256
		if _, err := rand.Read(key); err != nil {
			return err
		}
	}
	return nil
}

// ReadEncryptedFile decrypts and parses an encrypted file and stores the result in the interface called mapping
func ReadEncryptedFile(path string, mapping interface{}, logCh chan string) error {
	ciphertext, err := ReadFile(path, logCh)
	if err != nil {
		return err
	}

	plaintext, err := Decrypt(ciphertext, key)
	if err != nil {
		return err
	}

	err = json.Unmarshal(plaintext, mapping)
	if err != nil {
		return err
	}

	return nil
}

// WriteEncryptedFile encrypts and writes a data object called mapping to a file
func WriteEncryptedFile(path string, mapping interface{}, logCh chan string) error {
	err := generateKey()
	if err != nil {
		return err
	}

	jsonString, err := json.Marshal(mapping)
	if err != nil {
		return err
	}

	encrypted, err := Encrypt(jsonString, key)
	if err != nil {
		return err
	}

	err = WriteFile(path, logCh, encrypted)
	if err != nil {
		return err
	}
	return nil
}
