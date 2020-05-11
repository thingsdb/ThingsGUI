package util

import (
	"fmt"
	"io"
	"os"
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

// FileNotExist returns a boolean indicating if a file does not exists
func FileNotExist(path string) bool {
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
func CreateFile(path string, logCh chan string) (bool, error) {
	create := FileNotExist(path)
	if create {
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

// WriteFile writes data to a file and may return an error if something goes wrong
func WriteFile(path string, logCh chan string, data []byte) error {
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

// ReadFile reads a file and returns a byte array and may return an error when something goes wrong
func ReadFile(path string, logCh chan string) ([]byte, error) {
	// Open file for reading.
	file, err := os.OpenFile(path, os.O_RDWR, 0600)
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

		// Break if error occured
		if err != nil && err != io.EOF {
			return nil, err
		}
	}

	logCh <- fmt.Sprintln("Reading from file.")
	return b.data, nil
}

// DeleteFile deletes a file and may retun an error if somthing goes wrong
func DeleteFile(path string, logCh chan string) error {
	// delete file
	var err = os.Remove(path)
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("File Deleted")
	return nil
}

// GetHomePath returns the path of the local home folder
func GetHomePath(fileName string) string {
	var dir string
	dir, _ = os.UserHomeDir()
	path := fmt.Sprintf("%s/%s", dir, fileName)
	return path
}
