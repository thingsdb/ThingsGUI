package util

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
	"unicode/utf8"
)

type TmpFiles struct {
	generated map[string]bool
}

var tmp = TmpFiles{}

func Init(logChan chan string) {
	tmp.generated = make(map[string]bool)
}

func createBinFileLink(t string) string {
	var err error
	var hostname string

	content := []byte(t)
	tmpfile, err := ioutil.TempFile("", "thingsdb-cache-")
	if err != nil {
		fmt.Println(err)
	}
	tmp.generated[tmpfile.Name()] = true

	if _, err := tmpfile.Write(content); err != nil {
		fmt.Println(err)
	}
	if err := tmpfile.Close(); err != nil {
		fmt.Println(err)
	}

	hostname, err = os.Hostname()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("name: ", tmpfile.Name())
	return fmt.Sprintf("http://%s/download%s", hostname, tmpfile.Name())
}

func ReplaceBinStrWithLink(thing interface{}) {
	switch v := thing.(type) {
	case []interface{}:
		for i := 0; i < len(v); i++ {
			if t, ok := v[i].(string); ok {
				if !utf8.ValidString(t) {
					v[i] = createBinFileLink(t)
				}
			} else {
				ReplaceBinStrWithLink(v[i])
			}
		}
	case map[string]interface{}:
		for k := range v {
			if t, ok := v[k].(string); ok {
				if !utf8.ValidString(t) {
					v[k] = createBinFileLink(t)
				}
			} else {
				ReplaceBinStrWithLink(v[k])
			}
		}
	default:
		// no match; here v has the same type as i
	}
}

func CleanupTmp() error { // cleanup at end of session
	var err error
	for k, _ := range tmp.generated {
		err = os.Remove(k)
		if err != nil && !strings.Contains(err.Error(), "no such file or directory") {
			return err
		} else {
			delete(tmp.generated, k)
		}
	}
	return nil
}
