package main

import (
	"sync"

	things "github.com/thingsdb/go-thingsdb"
)

type roomStore struct {
	store map[uint64]*things.Room
	mux   sync.Mutex
}

func newRoomStore() *roomStore {
	return &roomStore{
		store: make(map[uint64]*things.Room),
	}
}

func (rs *roomStore) getRoom(id uint64) (*things.Room, bool) {
	rs.mux.Lock()
	room, ok := rs.store[id]
	rs.mux.Unlock()
	return room, ok
}
