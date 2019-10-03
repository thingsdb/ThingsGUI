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

func NewTmpFiles() *TmpFiles {
	return &TmpFiles{
		generated: make(map[string]bool),
	}
}

func (tmp *TmpFiles) createBinFileLink(t string) (string, error) {
	var err error
	var hostname string

	content := []byte(t)
	tmpfile, err := ioutil.TempFile("", "thingsdb-cache-")
	if err != nil {
		return "", err
	}
	if _, err = tmpfile.Write(content); err != nil {
		os.Remove(tmpfile.Name())
		return "", err
	}
	if err = tmpfile.Close(); err != nil {
		os.Remove(tmpfile.Name())
		return "", err
	}

	hostname, err = os.Hostname()
	if err != nil {
		os.Remove(tmpfile.Name())
		return "", err
	}
	tmp.generated[tmpfile.Name()] = true
	return fmt.Sprintf("http://%s/download%s", hostname, tmpfile.Name()), nil
}

func (tmp *TmpFiles) ReplaceBinStrWithLink(thing interface{}) error {
	var err error
	switch v := thing.(type) {
	case []interface{}:
		for i := 0; i < len(v); i++ {
			if t, ok := v[i].(string); ok {
				if !utf8.ValidString(t) {
					v[i], err = tmp.createBinFileLink(t)
					if err != nil {
						return err
					}
				}
			} else {
				err = tmp.ReplaceBinStrWithLink(v[i])
				if err != nil {
					return err
				}
			}
		}
	case map[string]interface{}:
		for k := range v {
			if t, ok := v[k].(string); ok {
				if !utf8.ValidString(t) {
					v[k], err = tmp.createBinFileLink(t)
					if err != nil {
						return err
					}
				}
			} else {
				err = tmp.ReplaceBinStrWithLink(v[k])
				if err != nil {
					return err
				}
			}
		}
	default:
		// no match; here v has the same type as i
	}

	return nil
}

func (tmp *TmpFiles) CleanupTmp() error { // cleanup at end of session
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
