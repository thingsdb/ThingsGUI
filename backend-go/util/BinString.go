package util

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"unicode/utf8"
)

type UniqueRand struct {
	generated map[int]bool
}

var uniq = UniqueRand{}

func Init(logChan chan string) {
	uniq.generated = make(map[int]bool)
}

func (u *UniqueRand) uniqueId() int {
	for {
		i := rand.Int()
		if !u.generated[i] {
			u.generated[i] = true
			return i
		}
	}
}

func createBinFileLink(t string) string {
	var err error
	var hostname string
	guid := uniq.uniqueId()

	err = ioutil.WriteFile(fmt.Sprintf("/tmp/%d", guid), []byte(t), 0644) // afhandelen dat niet iedere keer een nieuwe file wordt weggeschreven
	if err != nil {
		fmt.Println(err)
	}

	hostname, err = os.Hostname()
	if err != nil {
		fmt.Println(err)
	}

	return fmt.Sprintf("http://%s/download/%d", hostname, guid)
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
