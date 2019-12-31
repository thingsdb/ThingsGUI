package util

import (
	"fmt"
	"io"
	"os"
)

var key = []byte("jdyw3ts4dkflp8orftr7vd6372jqzpta")

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

func CreateFile(path string, logCh chan string) error {
	// check if file exists
	var _, err = os.Stat(path)

	// create file if not exists
	if os.IsNotExist(err) {
		var file, err = os.Create(path)
		if err != nil {
			return err
		}
		defer file.Close()
	}

	logCh <- fmt.Sprintln("File Created Successfully", path)
	return nil
}

func WriteFile(path string, logCh chan string, data []byte) error {
	// Open file using READ & WRITE permission.
	var file, err = os.OpenFile(path, os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	// Write some text line-by-line to file.

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

func ReadFile(path string, logCh chan string) ([]byte, error) {
	// Open file for reading.
	file, err := os.OpenFile(path, os.O_RDWR, 0644)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	// Read file, line by line
	b := newBuffer()
	for {
		n, err := file.Read(b.data[b.len:])
		b.len += n

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

func DeleteFile(path string, logCh chan string) error {
	// delete file
	var err = os.Remove(path)
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("File Deleted")
	return nil
}
