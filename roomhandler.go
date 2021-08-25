package main

import "strconv"

// Join a room
func Join(client *client, data data, timeout uint16) (int, interface{}, message) {
	scope := data.scope
	ids := data.ids
	idsInt := make([]uint64, 0)

	if len(ids) > 0 {
		for _, v := range ids {
			id, _ := strconv.ParseUint(v, 10, 64)
			idsInt = append(idsInt, id)
		}
	}

	resp, err := client.connection.Join(scope, idsInt, timeout)
	message := msg(err)
	return message.Status, resp, message
}

// Leave a room
func Leave(client *client, data data, timeout uint16) (int, interface{}, message) {
	scope := data.scope
	ids := data.ids
	idsInt := make([]uint64, 0)

	if len(ids) > 0 {
		for _, v := range ids {
			id, _ := strconv.ParseUint(v, 10, 64)
			idsInt = append(idsInt, id)
		}
	}

	resp, err := client.connection.Leave(scope, idsInt, timeout)
	message := msg(err)
	return message.Status, resp, message
}
