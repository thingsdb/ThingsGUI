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
  * [ThingsGUI tour](#thingsgui-tour)
    * [Collections](#collections)
        * [Configuration](#configuration)
        * [Things tree](#things-tree)
        * [Procedures](#procedures)
        * [Types](#types)
    * [Users](#users)
        * [Configuration](#configuration)
        * [Access rules](#access-rule)
        * [Tokens](#tokens)
    * [Nodes](#nodes)
        * [Configuration](#configuration)
        * [Backups](#Backups)
    * [Watcher](#watcher)
    * [Editor](#editor)
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


## ThingsGUI tour
Next follows a brief tour of ThingsGUI. A more detailed tour can be found here [here](LINK). We assume you have already a basic understanding of ThingsDB. If not we suggest you first read [ThingsDocs](https://docs.thingsdb.net/v0/).

Note that your personal [access rules](https://docs.thingsdb.net/v0/thingsdb-api/grant/) may restrict you from some of the views and actions we will summarize here.

### Collections
ThingsDB can contain multiple collections. Each collection can be thought of as an object to which properties can be assigned. We call such an object a Thing.

Each collection has its own overview containing the following elements.

#### Configuration
Basic information about the collection can be found in the __INFO__ container. It is possible to create, rename and delete a collection depending on your personal access rules.

#### Things tree
The __THINGS TREE__ panel contains a tree-like overview of all the properties stored in the selected collection.

Clicking a property will open a dialog where you can add, edit, delete and watch a property. It really depends on the type (e.g. string, integer, list, thing etc.) of the property what action is possible. A link to the code editor is also included.

To modify the __root thing__ you need to click on the key tool icon.

#### Procedures
The __PROCEDURES__ panel shows all the procedures within the selected collection. A procedure in ThingsDB is a prepared piece of code that you can save, so it can be reused.

It is possible to add, edit and delete a procedure.

#### Types
The __TYPES__ panel shows all the collection-specific types. The types are like things but with pre-defined properties.

It is possible to add, edit and delete such a type.


### Users
The __USERS__ panel shows all the users if you have `GRANT` rights. Otherwise the list will only contain you.

#### Configuration
If you have `GRANT` rights it is possible to add, rename and delete a user and to set and reset the password.
If you have `READ` rights it is still possible to set and reset your password.

#### Access rules

If you have `GRANT` rights it is possible to modify the __ACCESS RULES__ of yourself and others.

#### Tokens
If you have `GRANT` rights it is possible to add and delete tokens.

### Nodes
#### Configuration

#### Backups

### Watcher

### Editor
The editor provides a way to interact with ThingsDB on a more lower level by using ThingsDB's own language. You can choose to code instead of using the graphical interface and build scripts that to a bunch of things. It is even possible to store these scripts in a procedure. To help a bit with learning the language, ThingsGUI often provides the query that goes along with an action when done using the graphical interface.

When sending a query, calling a procedure or subscribing to a thing, the request will require you to provide a scope. ThingsDB has three main scopes: @thingsdb, @node and @collection. Next to the editor you find the __SCOPES__ panel where you can change the scope.

Depending on the scope you may also see a __PROCEDURES__ and __TYPES__ panel including the procedures and types that are stored.





