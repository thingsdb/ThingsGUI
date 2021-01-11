package util

// Convert float value to integer if possible.
func Convert(arg interface{}) interface{} {
	switch v := arg.(type) {
	case []interface{}:
		arr := make([]interface{}, 0)
		for i := 0; i < len(v); i++ {
			r := Convert(v[i])
			arr = append(arr, r)
		}
		return arr
	case map[string]interface{}:
		dict := make(map[string]interface{})
		for k := range v {
			r := Convert(v[k])
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
