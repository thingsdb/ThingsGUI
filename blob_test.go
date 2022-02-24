package main

import (
	"fmt"
	"testing"
)

func TestBinString(t *testing.T) {
	tmp := newTmpFiles()

	//TEST 1
	_, err := tmp.createBinFileLink([]byte("hello people"))

	if err != nil {
		t.Errorf("TEST 1: FAILED. Something went wrong: %s\n", err)
	}

	//TEST 2
	testThing := map[string]interface{}{
		"Data": []interface{}{
			map[string]interface{}{"string": "John", "int": 35, "bytes": []byte("I am bin data")},
			map[string]interface{}{"string": "Jane", "int": 23, "bytes": []byte("I am bin data")},
			map[string]interface{}{"string": "Mary", "int": 12, "bytes": []byte("I am bin data")},
		},
	}
	testThing2 := []byte("I am bin data")

	_, err1 := tmp.replaceBinStrWithLink(testThing)
	_, err2 := tmp.replaceBinStrWithLink(testThing2)

	if err1 != nil {
		t.Errorf("TEST 2: FAILED. Something went wrong: %s\n", err1)
	} else if err2 != nil {
		t.Errorf("TEST 2: FAILED. Something went wrong: %s\n", err2)
	}

	targetMap := make(map[string]bool)
	// Copy from the original map to the target map
	for key, value := range tmp.generated {
		targetMap[key] = value
	}

	//TEST 3
	tmp.cleanupTmp()

	success := true
	for k := range targetMap {
		if fileNotExist(fmt.Sprintf("/tmp/%s", k)) {
			fmt.Printf("* %s has been removed\n", k)
		} else {
			success = false
			t.Errorf("%s still exists\n", k)
		}
	}
	if !success {
		t.Errorf("Test 3: FAILED.\n")
	}
}
