package main

import (
	"strings"
)

func IsTrue(str string) bool {
	yesMap := map[string]struct{}{
		"yes":  struct{}{},
		"y":    struct{}{},
		"true": struct{}{},
		"1":    struct{}{},
	}
	_, ok := yesMap[strings.ToLower(str)]
	return ok
}
