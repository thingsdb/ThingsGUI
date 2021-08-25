package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

// TmpFiles keeps track of generated files
type tmpFiles struct {
	generated map[string]bool
}

// NewTmpFiles create a new tmp struct
func newTmpFiles() *tmpFiles {
	return &tmpFiles{
		generated: make(map[string]bool),
	}
}

func (tmp *tmpFiles) createBinFileLink(content []byte) (string, error) {
	var err error
	var hostname string

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

// ReplaceBinStrWithLink replace a binary string with a symlink
func (tmp *tmpFiles) replaceBinStrWithLink(thing interface{}) (interface{}, error) {
	var err error
	switch v := thing.(type) {
	case []interface{}:
		for i := 0; i < len(v); i++ {
			if t, ok := v[i].([]byte); ok {
				v[i], err = tmp.createBinFileLink(t)
				if err != nil {
					return nil, err
				}
			} else {
				_, err = tmp.replaceBinStrWithLink(v[i])
				if err != nil {
					return nil, err
				}
			}
		}
	case map[string]interface{}:
		for k := range v {
			if t, ok := v[k].([]byte); ok {
				v[k], err = tmp.createBinFileLink(t)
				if err != nil {
					return nil, err
				}
			} else {
				_, err = tmp.replaceBinStrWithLink(v[k])
				if err != nil {
					return nil, err
				}
			}
		}
	case []byte:
		var s string
		s, err = tmp.createBinFileLink(v)
		if err != nil {
			return nil, err
		} else {
			return s, nil
		}
	default:
		// no match; here v has the same type as i
	}

	return nil, nil
}

// CleanupTmp removes downloaded blob files from local tmp folder
func (tmp *tmpFiles) cleanupTmp() error { // cleanup at end of session
	var err error
	for k := range tmp.generated {
		err = os.Remove(k)
		delete(tmp.generated, k)
		if err != nil && !strings.Contains(err.Error(), "no such file or directory") {
			return err
		}
	}
	return nil
}
