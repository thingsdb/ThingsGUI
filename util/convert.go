package util

import (
	"fmt"
)

func Convert(arg interface{}, convertArgs bool, enableInts bool) interface{} {
	fmt.Printf("start conv: %T\n", arg)
	switch v := arg.(type) {
	case []interface{}:
		arr := make([]interface{}, 0)
		for i := 0; i < len(v); i++ {
			r := Convert(v[i], convertArgs, enableInts)
			arr = append(arr, r)
		}
		return arr
	case map[string]interface{}:
		id := v["#"]
		fmt.Println("id", id)
		if id != nil && convertArgs {
			if t, ok := id.(float64); ok {
				return map[string]int{"#": int(t)}
			} else {
				return nil
			}
		} else {
			dict := make(map[string]interface{})
			for k := range v {
				r := Convert(v[k], convertArgs, enableInts)
				dict[k] = r
			}
			return dict
		}
	case float64:
		if enableInts {
			i := int(v)
			f := float64(i)

			if v == f {
				return i
			} else {
				return v
			}
		}
	}
	return arg
}
