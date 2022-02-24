package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"
)

func TestIsTrue(t *testing.T) {
	testStrTrue := []string{"yes", "y", "true", "1"}
	testStrFalse := []string{"false", "test"}

	for _, str := range testStrTrue {
		if !isTrue(str) {
			t.Errorf("TEST 8: isTrue FAILED: IsTrue should return TRUE for string: %s.\n", str)
		}
	}

	for _, str := range testStrFalse {
		if isTrue(str) {
			t.Errorf("TEST 8: isTrue FAILED: IsTrue should return FALSE for string: %s.\n", str)
		}
	}
}

func TestConvertFloatToInt(t *testing.T) {
	testFloatInt := "{\"a\": [2.0, 3.0], \"b\": 4.0, \"c\": 4.5}"
	var args interface{}
	decoder := json.NewDecoder(strings.NewReader(testFloatInt))
	if err := decoder.Decode(&args); err != nil {
		t.Errorf("TEST 9 convertFloatToInt: JsonDecoder FAILED: %s.\n", err)
	}
	testInt := convertFloatToInt(args)

	if mapInterface, ok := testInt.(map[string]interface{}); ok {
		if listInterface, ok := mapInterface["a"].([]interface{}); ok {
			if _, ok := listInterface[0].(int); !ok {
				t.Errorf("TEST 9: convertFloatToInt FAILED: testFloatInt[\"a\"] should should contain integer values, but have type %T.\n", listInterface[0])
			}
		} else {
			t.Errorf("TEST 9: convertFloatToInt FAILED: mapInterface[\"a\"] can not be converted to type []interface{}: %T.\n", mapInterface["a"])
		}

		if _, ok := mapInterface["b"].(int); !ok {
			t.Errorf("TEST 9: convertFloatToInt FAILED: testFloatInt[\"b\"] should be of type int, but has type %T.\n", mapInterface["b"])
		}

		if _, ok := mapInterface["c"].(int); ok {
			t.Errorf("TEST 9: convertFloatToInt FAILED: testFloatInt[\"c\"] should be of type float64 and should not be converted.\n")
		}
	} else {
		t.Errorf("TEST 9: convertFloatToInt FAILED: testInt can not be converted to type map[string]interface{}: %s.\n", testInt)
	}
}

func TestChangeFile(t *testing.T) {
	path := getHomePath("things-gui_test")
	logCh := make(chan string, 1)
	go func() {
		for p := range logCh {
			fmt.Printf("Logging: %s", p)
		}
	}()

	fn1 := func(mapping lMapping) error {
		mapping["test"] = map[string]interface{}{
			"test": "test",
		}
		return nil
	}

	err := changeFile(path, logCh, fn1)
	if err != nil {
		t.Errorf("TEST 10: changeFile FAILED: %s.\n", err)
	}

	fn2 := func(mapping lMapping) error {
		if _, ok := mapping["test"]; !ok {
			return fmt.Errorf("TEST 10: FAILED; mapping does not contain the key \"test\". Mapping: %s", mapping)
		}
		return nil
	}

	err = changeFile(path, logCh, fn2)
	if err != nil {
		t.Errorf("TEST 10: changeFile FAILED: %s.\n", err)
	}

	err = deleteFile(path, logCh)
	if err != nil {
		t.Errorf("TEST 10: deleteFile FAILED: %s.\n", err)
	}
}
