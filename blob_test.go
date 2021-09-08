package main

import (
	"fmt"
	"testing"
)

func TestBinString(t *testing.T) {
	tmp := newTmpFiles()

	//TEST 1
	fmt.Println("Test 1: Creating new binary files and return link")
	filename, err := tmp.createBinFileLink([]byte("hello people"))

	if err != nil {
		t.Errorf("Test 1: FAILED. Something went wrong: %s\n", err)
	} else {
		fmt.Printf("Test 1: SUCCESSFULL. File %s is created!\n", filename)
	}

	//TEST 2
	fmt.Println("Adding data...")
	testThing := map[string]interface{}{
		"Data": []interface{}{
			map[string]interface{}{"string": "John", "int": 35, "bytes": []byte("I am bin data")},
			map[string]interface{}{"string": "Jane", "int": 23, "bytes": []byte("I am bin data")},
			map[string]interface{}{"string": "Mary", "int": 12, "bytes": []byte("I am bin data")},
		},
	}
	testThing2 := []byte("I am bin data")

	fmt.Println("TEST 2: Replacing binary data with link...")
	_, err1 := tmp.replaceBinStrWithLink(testThing)
	resp, err2 := tmp.replaceBinStrWithLink(testThing2)

	if err1 != nil {
		t.Errorf("Test 2: FAILED. Something went wrong: %s\n", err1)
	} else if err2 != nil {
		t.Errorf("Test 2: FAILED. Something went wrong: %s\n", err2)
	} else {
		fmt.Println("Test 2: SUCCESSFULL. Binary data nested inside a slice and map have been replaced with the following download links:")
		fmt.Printf("* %s\n* %s\n* %s\n", testThing["Data"].([]interface{})[0].(map[string]interface{})["bytes"], testThing["Data"].([]interface{})[1].(map[string]interface{})["bytes"], testThing["Data"].([]interface{})[2].(map[string]interface{})["bytes"])

		fmt.Println("Test 2: SUCCESSFULL. Binary data has been replaced with a download link:")
		fmt.Printf("* %s\n", resp)
	}

	targetMap := make(map[string]bool)
	// Copy from the original map to the target map
	for key, value := range tmp.generated {
		targetMap[key] = value
	}

	//TEST 3
	fmt.Println("TEST 3: Cleaning temp folder...")
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
	if success {
		fmt.Println("Test 3: SUCCESSFULL.")
	} else {
		t.Errorf("Test 3: FAILED.\n")
	}
}
