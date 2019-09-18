package main

import (
	"flag"

	app "./backend-go"
)

var (
	host string
	port uint
	//debugMode  bool
	//configFile string
)

func init() {
	flag.StringVar(&host, "host", "localhost", "host")
	flag.UintVar(&port, "port", 8081, "Port")
	//flag.BoolVar(&debugMode, "debug mode", false, "Debug ")
	//flag.StringVar(&configFile, "config file", "default.conf", "Config file")

	flag.Parse()
}

func main() {
	a := app.App{}
	a.Host = host
	a.Port = uint16(port)
	a.Start()
}
