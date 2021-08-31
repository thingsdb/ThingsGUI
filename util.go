package main

import (
	"os/exec"
	"runtime"
	"strings"
)

func isTrue(str string) bool {
	yesMap := map[string]struct{}{
		"yes":  struct{}{},
		"y":    struct{}{},
		"true": struct{}{},
		"1":    struct{}{},
	}
	_, ok := yesMap[strings.ToLower(str)]
	return ok
}

// changeFile creates a file or makes changes to an existing file.
func changeFile(path string, logCh chan string, fn func(lMapping) error) error {
	newFile, err := createFile(path, logCh)
	if err != nil {
		return err
	}

	mapping := make(lMapping)
	if !newFile {
		err = readEncryptedFile(path, &mapping, logCh)
		if err != nil {
			err = deleteFile(path, logCh)
			if err != nil {
				return err
			}

			_, err := createFile(path, logCh)
			if err != nil {
				return err
			}
		}
	}

	err = fn(mapping)
	if err != nil {
		return err
	}

	err = writeEncryptedFile(path, mapping, logCh)
	if err != nil {
		return err
	}

	return nil
}

// convertFloatToInt converts float value to integer if possible (only interfaces will be converted).
func convertFloatToInt(arg interface{}) interface{} {
	switch v := arg.(type) {
	case []interface{}:
		arr := make([]interface{}, 0)
		for i := range v {
			r := convertFloatToInt(v[i])
			arr = append(arr, r)
		}
		return arr
	case map[string]interface{}:
		dict := make(map[string]interface{})
		for k := range v {
			r := convertFloatToInt(v[k])
			dict[k] = r
		}
		return dict
	case float64:
		i := int(v)
		f := float64(i)

		if v == f {
			return i
		}
		return v

	}
	return arg
}

func open(url string) error { //https://stackoverflow.com/questions/39320371/how-start-web-server-to-open-page-in-browser-in-golang
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Run()
}

func internalError(err error) (int, interface{}, message) {
	message := failedMsg(err)
	return message.Status, nil, message
}
