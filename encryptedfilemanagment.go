package main

import (
	"encoding/json"
)

var key = []byte("jdyw3ts4dkflp8orftr7vd6372jqzpta")

// readEncryptedFile decrypts and parses an encrypted file and stores the result in the interface called mapping
func readEncryptedFile(path string, mapping interface{}, logCh chan string) error {
	ciphertext, err := readFile(path, logCh)
	if err != nil {
		return err
	}

	plaintext, err := decrypt(ciphertext, key)
	if err != nil {
		return err
	}

	err = json.Unmarshal(plaintext, mapping)
	if err != nil {
		return err
	}

	return nil
}

// writeEncryptedFile encrypts and writes a data object called mapping to a file
func writeEncryptedFile(path string, mapping interface{}, logCh chan string) error {
	jsonString, err := json.Marshal(mapping)
	if err != nil {
		return err
	}

	encrypted, err := encrypt(jsonString, key)
	if err != nil {
		return err
	}

	err = writeFile(path, logCh, encrypted)
	if err != nil {
		return err
	}
	return nil
}
