package main

import (
	"flag"

	app "./backend-go"
)

var (
	host    string
	port    uint
	timeout uint
	//debugMode  bool
	//configFile string
)

func init() {
	flag.StringVar(&host, "host", "localhost", "host")
	flag.UintVar(&port, "port", 8080, "Port")
	flag.UintVar(&timeout, "timeout", 30, "timeout")
	//flag.BoolVar(&debugMode, "debug mode", false, "Debug ")
	//flag.StringVar(&configFile, "config file", "default.conf", "Config file")

	flag.Parse()
}

func main() {
	a := app.App{}
	a.Host = host
	a.Port = uint16(port)
	a.Timeout = uint16(timeout)
	a.Start()
}
