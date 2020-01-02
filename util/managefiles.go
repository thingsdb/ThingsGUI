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

func CreateFile(path string, logCh chan string) (bool, error) {
	create := FileNotExist(path)
	if create {
		file, err := os.Create(path)
		if err != nil {
			return false, err
		}
		logCh <- fmt.Sprintln("File Created Successfully", path)
		defer file.Close()
	}

	return create, nil
}

func WriteFile(path string, logCh chan string, data []byte) error {
	// Open file using READ & WRITE permission.
	var file, err = os.OpenFile(path, os.O_RDWR, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	// Write some text line-by-line to file.
	err = file.Truncate(0)
	if err != nil {
		return err
	}
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

func DeleteFile(path string, logCh chan string) error {
	// delete file
	var err = os.Remove(path)
	if err != nil {
		return err
	}

	logCh <- fmt.Sprintln("File Deleted")
	return nil
}
