# ThingsGUI
<!-- ![alt SiriDB Admin](/siridb-admin.png?raw=true) -->

Tool for managing ThingsDB user accounts, nodes and collections. ThingsGUI is a graphical web-interface.

---------------------------------------
  * [Requirements](#requirements)
  * [Installation](#installation)
    * [Pre-compiled](#pre-compiled)
    * [Compile from source](#compile-from-source)
  * [Startup ThingsGUI](#starting-thingsgui)
    * [Command-line arguments](#command-line-arguments)
    * [Login](#login)
        * [Socket Address](#socket-address)
        * [Authentication](#authentication)
        * [Secure connection (TLS)](#secure-connection-tls)
        * [Saving connections](#save-connections)
  * [ThingsGUI environment tour](#thingsgui-environment-tour)
    * [Collections](#collections)
        * [Configuration](#configuration)
        * [Things tree](#things-tree)
        * [Procedures](#procedures)
        * [Types](#types)
    * [Users](#users)
        * [Configuration](#configuration)
        * [Access rules](#access-rule)
        * [Tokens](#tokens)
    * [Editor](#editor)
    * [Nodes](#nodes)
        * [Configuration](#configuration)
        * [Backups](#Backups)
    * [Watcher](#watcher)
---------------------------------------
## Requirements
ThingsGUI works with ThingsDB version 0.4.4 and higher.

## Installation
ThingsGUI can be compiled from source or, for most systems, you can simply download a pre-compiled binary.

### Pre-compiled
Go to https://github.com/thingsdb/ThingsGUI/releases and download the binary for your system.
In this documentation we refer to the binary as `thingsdb-gui`. On Linux/OSX it might be required to set the execution flag:
```
$ chmod +x thingsdb-gui_X.Y.Z_OS_ARCH.bin
```

You might want to copy the binary to /usr/local/bin and create a symlink like this:
```
$ sudo cp thingsdb-gui_X.Y.Z_OS_ARCH.bin /usr/local/bin/
$ sudo ln -s /usr/local/bin/thingsdb-gui_X.Y.Z_OS_ARCH.bin /usr/local/bin/thingsdb-gui
```
Note: replace `X.Y.Z_OS_ARCH` with your binary, for example `1.2.0_linux_amd64`

### Compile from source
> Before compiling from source make sure **go**, **npm** and **git** are installed and your [$GOPATH](https://github.com/golang/go/wiki/GOPATH) is set.

Clone the project using git. (we assume git is installed)
```
git clone https://github.com/thingsdb/ThingsGUI
```

The gobuild.py script can be used to build the binary:
```
$ ./gobuild.py -o ./thingsdb-gui
```

## Startup ThingsGUI

### Command line with related argument flags

ThingsGui can be started with the following command:
```
./thingsdb-gui
```
The ThingsGUI web interface will be opened in your default browser and the webserver will listen on 0.0.0.0:5000.

You might want to use a different host and port for the webserver. This can be done by adding the following argument flags `-host` and `-port`. If you don't want ThingsGUI to open in a browser automatically, you can set the argument flag `-open`.

The last argument is `-timeout`. This flag can be used to change the connect and query timeout. The time unit is in seconds and by default the timeout is set to 30 seconds.

For example:
```
./thingsdb-gui -host localhost -port 8080 -open false -timeout 60
```

### Login

Once ThingsDB is running you can connect to a node. This just takes a couple of steps and then you will enter your personal environment.

#### Socket Address
Enter the __socket address__ of the node. The socket address is a combination of an IP address and port number; e.g. `localhost:9200`.

#### Authentication
Enter your credentials. There are two ways of authentication: with a __username+password__ or with a __token__. Note that a token can have an expiration date and may be expired.

#### Secure connection (TLS)
The __secure connection (TLS)__ has to be switched on if the connection with ThingsDB needs to be on a secure line. Otherwise connecting to ThingsDB is not possible. You also need to determine if you allow __insecure certificates__.

#### Saving connections
You can save the connection configuration locally if you like to speed up the process next time. To do this you need to click the _SAVE_ button that you can find in the bottom left corner of the login dialog. This will open a dialog where you can enter a recognizable name that will serve as an alias for the connection configuration. The saved connections can be altered as well as deleted.


## ThingsGUI environment tour

### Collections

#### Configuration
#### Things tree
#### Procedures
#### Type(#types)

### Users

#### Configuration
#### Access rules
#### Tokens

### Editor

### Nodes

#### Configuration
#### Backups

### Watcher


