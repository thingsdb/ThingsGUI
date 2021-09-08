package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

// buffer is used to read data from a connection.
type buffer struct {
	data []byte
	len  int
}

func newBuffer() *buffer {
	return &buffer{
		data: make([]byte, 0),
		len:  0,
	}
}

// createFile creates a file and returns a boolean if successfull and an error message when something goes wrong
func createDir(path string, logCh chan string) error {
	err := os.MkdirAll(path, 0700)
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("Dir Created Successfully", path)

	return nil
}

// fileNotExist returns a boolean indicating if a file does not exists
func fileNotExist(path string) bool {
	// check if file exists
	fileNotExist := false
	var _, err = os.Stat(path)

	// create file if not exists
	if os.IsNotExist(err) {
		fileNotExist = true
	}

	return fileNotExist
}

// CreateFile creates a file and returns a boolean if successfull and an error message when something goes wrong
func createFile(path string, logCh chan string) (bool, error) {
	create := fileNotExist(path)
	if create {
		dir := filepath.Dir(path)
		err := createDir(dir, logCh)
		if err != nil {
			return false, err
		}

		file, err := os.Create(path)
		if err != nil {
			return false, err
		}
		file.Chmod(0600)
		if err != nil {
			return false, err
		}
		logCh <- fmt.Sprintln("File Created Successfully", path)
		defer file.Close()
	}

	return create, nil
}

// writeFile writes data to a file and may return an error if something goes wrong
func writeFile(path string, logCh chan string, data []byte) error {
	// Open file using READ & WRITE permission.
	var file, err = os.OpenFile(path, os.O_RDWR|os.O_TRUNC, 0600)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	// Save file changes.
	err = file.Sync()
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("File Updated Successfully.")
	return nil
}

// readFile reads a file and returns a byte array and may return an error when something goes wrong
func readFile(path string, logCh chan string) ([]byte, error) {
	// Open file for reading.
	file, err := os.OpenFile(path, os.O_RDONLY, 0600)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Read file, line by line
	b := newBuffer()
	for {
		wbuf := make([]byte, 1024)
		n, err := file.Read(wbuf)
		b.len += n
		b.data = append(b.data, wbuf[:n]...)

		// Break if finally arrived at end of file
		if err == io.EOF {
			break
		}

		// Break if error occurred
		if err != nil && err != io.EOF {
			return nil, err
		}
	}

	logCh <- fmt.Sprintf("Reading from file: %s.", path)
	return b.data, nil
}

// deleteFile deletes a file and may retun an error if somthing goes wrong
func deleteFile(path string, logCh chan string) error {
	// delete file
	var err = os.Remove(path)
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("File Deleted")
	return nil
}

// getHomePath returns the path of the local home folder
func getHomePath(filepath string) string {
	var dir string
	dir, _ = os.UserHomeDir()
	path := fmt.Sprintf("%s/%s", dir, filepath)
	return path
}
