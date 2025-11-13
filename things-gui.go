package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"

	// "time"

	socketio "github.com/doquangtan/socketio/v4"
	"github.com/joho/godotenv"
)

// AppVersion exposes version information
const AppVersion = "1.3.3"

var cookieName = "uid"
var cookieMaxAge = 6048000 // (seconds) 10 weeks

var (
	// env variables
	thingsguiAddress    string
	thingsguiAuthMethod string
	thingsguiSsl        bool
	thingsguiAic        bool
	thingsguiTokenApi   string
	useLocalSession     bool
	useCookieSession    bool

	// flag variables
	disableOpenBrowser bool
	envPath            string
	serverHost         string
	serverPort         uint16
	timeout            uint16
)

func parseFlags() {
	var p uint
	var t uint

	flag.StringVar(&serverHost, "host", "localhost", "Specific host for the http webserver.")
	flag.StringVar(&envPath, "env", ".env", "Path of .env file.")
	flag.UintVar(&p, "port", 5000, "Specific port for the http webserver.")
	flag.UintVar(&t, "timeout", 0, "Connect and query timeout in seconds")
	flag.BoolVar(&disableOpenBrowser, "disable-open-browser", false, "opens ThingsGUI in your default browser")
	flag.Parse()

	serverPort = uint16(p)
	timeout = uint16(t)
}

func readEnvVariables() {
	err := godotenv.Load(envPath)
	if err != nil {
		fmt.Println(err)
	}

	thingsguiAddress = os.Getenv("THINGSGUI_ADDRESS")
	thingsguiAuthMethod = os.Getenv("THINGSGUI_AUTH_METHOD")
	thingsguiTokenApi = os.Getenv("THINGSGUI_TOKEN_API")

	if isTrue(os.Getenv("THINGSGUI_SSL")) {
		thingsguiSsl = true
		if isTrue(os.Getenv("THINGSGUI_AIC")) {
			thingsguiAic = true
		}
	}

	if isTrue(os.Getenv("THINGSGUI_USE_COOKIE_SESSION")) {
		useCookieSession = true
	}

	if isTrue(os.Getenv("THINGSGUI_USE_LOCAL_SESSION")) {
		useLocalSession = true
	}

	if isTrue(os.Getenv("USE_COOKIE_SESSION")) {
		fmt.Println("Environmental variable \"USE_COOKIE_SESSION\" is obsolete and renamed to \"THINGSGUI_USE_COOKIE_SESSION\"")
	}

	if isTrue(os.Getenv("USE_LOCAL_SESSION")) {
		fmt.Println("Environmental variable \"USE_LOCAL_SESSION\" is obsolete and renamed to \"THINGSGUI_USE_LOCAL_SESSION\"")
	}
}

func main() {
	app := app{}
	app.clients = make(map[string]*client)

	parseFlags()
	readEnvVariables()
	newSessions()

	app.server = socketio.New()

	// on interrup clean up
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for sig := range c {
			if sig == os.Interrupt {
				app.quit()
				os.Exit(1)
			}
		}
	}()

	app.start()
}
