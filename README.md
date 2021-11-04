# ThingsGUI v1

Tool for managing ThingsDB user accounts, nodes and collections. ThingsGUI is a graphical web-interface.

---------------------------------------

* [Requirements](#requirements)
* [Installation](#installation)
  * [Pre-compiled](#pre-compiled)
  * [Compile from source](#compile-from-source)
* [Start ThingsGUI](#start-thingsgui)
  * [Command line](#command-line)
  * [Login](#login)
    * [Socket Address](#socket-address-(1))
    * [Authentication](#authentication-(2))
    * [Secure connection (TLS)](#secure-connection-(tls)-(3))
    * [Saving connections](#saving-connections-(4))
    * [Fixed address mode](#fixed-address-mode)
* [ThingsGUI tour](#thingsgui-tour)
  * [Dashboard](#dashboard)
  * [Collections](#collections)
    * [Collection configuration](#collection-configuration-(1))
    * [Things tree](#things-tree-(2))
    * [Procedures](#procedures-(3))
    * [Tasks](#tasks-(4))
    * [Types](#types-(5))
    * [Enums](#enums-(6))
  * [Users](#users)
    * [User configuration](#user-configuration-(1))
    * [Access rules](#access-rules-(2))
    * [Tokens](#tokens-(3))
  * [Procedures](#procedures)
  * [Tasks](#tasks)
  * [Nodes](#nodes)
    * [Node configuration](#node-configuration)
    * [Backup](#Backup)
    * [Modules](#modules)
  * [Editor](#editor)

---------------------------------------

## Requirements

ThingsGUI v1 works with ThingsDB version 1.1.0 and higher.

---------------------------------------

## Installation

ThingsGUI can be compiled from source or, for most systems, you can simply download a pre-compiled binary.

### Pre-compiled

Go to https://github.com/thingsdb/ThingsGUI/releases/latest and download the binary for your system.
In this documentation we refer to the binary as `things-gui`. On Linux/OSX it might be required to set the execution flag:

```
chmod +x things-gui_X.Y.Z_OS_ARCH.bin
```

You might want to copy the binary to /usr/local/bin and create a symlink like this:

```
sudo cp things-gui_X.Y.Z_OS_ARCH.bin /usr/local/bin/
sudo ln -s /usr/local/bin/things-gui_X.Y.Z_OS_ARCH.bin /usr/local/bin/things-gui
```

---

Note: replace `X.Y.Z_OS_ARCH` with your binary, for example `1.2.0_linux_amd64`

---

### Compile from source

> Before compiling from source make sure **go**, **npm** and **git** are installed and your [$GOPATH](https://github.com/golang/go/wiki/GOPATH) is set.

Clone the project using git.

```
git clone https://github.com/thingsdb/ThingsGUI
```

Install the go-packages; the socket.io library for golang and the ThingsDB connector::

```
go get github.com/googollee/go-socket.io
go get github.com/thingsdb/go-thingsdb
```

Next go to `./src` folder and install the node modules and build the bundles :

```
npm install
npm run build:prod
```

Last, the gobuild.py script can be used to build the binary:

```
./gobuild.py -o ./things-gui
```

---------------------------------------



## Start ThingsGUI

### Command line

ThingsGUI can be started with the following command:

```
things-gui
```

The ThingsGUI web interface opens in your default browser and the web server listens on http://localhost:5000/. To change some default settings you can use the following flags:

flag | default | description
-------- | ---- | -----------
`-host` | localhost | To change the web server's host.
`-port` | 5000 | To change the web server's port .
`-disable-open-browser` | false | To disable that ThingsGUI opens immediately in a browser on start.
`-timeout` | 60 sec | To change the connect and query timeout. The time unit is in seconds.

Example:
```
./things-gui -host localhost -port 8080 -timeout 30 -disable-open-browser
```

### Login

<img src="readme/img/login_new_connection.png?" alt="alt Login" style="zoom:80%;" />

Once ThingsDB is running you can connect to one node. This just takes a couple of steps:

#### Socket Address (1)

Enter the __socket address__ of the node e.g. `localhost:9200`.

#### Authentication (2)

Enter your credentials. There are two ways of authentication:  __user name+password__ or __token__. Note that a token can have an expiration date.

#### Secure connection (TLS) (3)

The __secure connection (TLS)__ has to be switched on if the connection with ThingsDB needs to be on a secure line. Otherwise connecting to ThingsDB is not possible. If  you do not have a valid certificate, you may enable the option __allow insecure certificates__.

#### Saving connections (4)

It is possible to save the connection configuration locally. To do this you need to click the __SAVE__ button that you can find in the bottom left corner of the login dialog. This opens a dialog where you can enter a recognizable name that will serve as an alias. The saved connections can be altered as well as deleted later.

<img src="readme/img/login_connections.png?" alt="alt Login" style="zoom:80%;" />

#### Fixed address mode
By setting the environmental variable `THINGSGUI_ADDRESS` the GUI has a fixed address and the login only displays the [Authentication](#authentication) part. The following `.env` variables can be configured:

* `THINGSGUI_ADDRESS`: ThingsDB socket address
* `THINGSGUI_AUTH_METHOD`: method of authentication; either a token, pass or both.
* `THINGSGUI_SSL`: Needs a secure connection or not
* `THINGSGUI_AIC`: Allow insecure certificates or not

#### Save session
Additional `.env` variables can be set to remember the last login:

* `THINGSGUI_USE_COOKIE_SESSION`: Set it true/false.
* `THINGSGUI_USE_LOCAL_SESSION`: Set it true/false.

When you enable `THINGSGUI_USE_COOKIE_SESSION` the last session can be saved using cookies. Though the user needs to accept these cookies first.

When you enable `THINGSGUI_USE_LOCAL_SESSION` the last session is saved in the user's home directory as `.config/ThingsGUI/thingsgui.session`.

---

Note: `THINGSGUI_USE_LOCAL_SESSION` should only be enabled if the app is used locally by one user.

---

## ThingsGUI tour

Next follows a brief tour of ThingsGUI. We assume that you have a basic understanding of ThingsDB. If not we suggest you first read [ThingsDocs](https://docs.thingsdb.net/v1/).

---

Note: that your personal [access rules](https://docs.thingsdb.net/v1/thingsdb-api/grant/) may restrict you from some of the views and actions we will summarize here.

---

### Dashboard

<img src="readme/img/dashboard.png?" alt="alt Login" style="zoom:100%;" />

After logging, you will see this dashboard containing some basic numbers and figures. Clicking the arrow up will close this page and show you the main view. To go back to this page you just need to click the ThingsGUI icon.



### Collections

<img src="readme/img/collection.png?" alt="alt Login" style="zoom:100%;" />

ThingsDB can contain multiple [collections](https://docs.thingsdb.net/v1/overview/collections/). Each collection can be thought of as an object to which properties can be assigned. We call that object a Thing.

Each collection has its own overview containing the following elements.

#### Collection configuration (1)

Basic information about the collection can be found in the __INFO__ container. It is possible to create, rename and delete a collection depending on your personal access rules. A collection name must conform to certain [naming rules](https://docs.thingsdb.net/v1/overview/names/).

#### Things tree (2)

<img src="readme/img/tree_item.png?" alt="alt Login" style="zoom:70%;" />

The __THINGS TREE__ panel contains a tree-like overview of all the [properties](https://docs.thingsdb.net/v1/overview/properties/) stored in the selected collection.

Click <img src="readme/img/key_tool_icon.png" alt="alt watch" width="30px" />  to open a dialog where you can add, edit and delete a property. It really depends on the type (e.g. string, integer, list, thing etc.) of the property which of the above mentioned actions are possible.

In case of type [Room](https://docs.thingsdb.net/v1/data-types/room/) you also find a button to join or leave this room.

Clicking <img src="readme/img/code_editor_icon.png" alt="alt watch" width="30px" /> will direct you to the code editor.

#### Procedures (3)

<img src="readme/img/collection_procedure.png?" alt="alt Login" style="zoom:70%;" />

A [procedure](https://docs.thingsdb.net/v1/procedures-api/) in ThingsDB is a prepared piece of code that you can save, so it can be reused.

It is possible to add, edit, delete and run a procedure. The above image shows the modal to edit the "add_one" procedure.

---

Note: there does not exist a `mod_procedure` method like `mod_type`. In this case, a procedure is deleted and re-created.

---

#### Tasks (4)

<img src="readme/img/collection_task.png?" alt="alt Login" style="zoom:70%;" />

A [task](https://docs.thingsdb.net/v1/data-types/task/) in ThingsDB is a closure that is attached to a scope and runs at a scheduled time. Tasks may be re-scheduled or run as a one-time task.

It is possible to add, edit the arguments, owner and closure. A task can be canceled and deleted.

#### Types (5)

<img src="readme/img/type.png?" alt="alt Login" style="zoom:70%;" />

A [type](https://docs.thingsdb.net/v1/data-types/type/) is like thing but with pre-defined properties.

It is possible to add, edit and delete such a type.

---

Note: if there are still instances left of a type you want to delete, then all instances will be converted to Things. No properties will be removed in this process. With `type_count(..)` you can view the number of instances of a certain type.

---

#### Enums (6)

<img src="readme/img/enum.png?" alt="alt Login" style="zoom:70%;" />

An [enum](https://docs.thingsdb.net/v1/data-types/enum/) is a set of unique names coupled to a unique set of values.

It is possible to add, edit and delete an enum.

### Users

<img src="readme/img/user.png?" alt="alt Login" style="zoom:70%;" />

The __USERS__ panel shows all the [users](https://docs.thingsdb.net/v1/thingsdb-api/) if you have `GRANT` rights. Otherwise the list will only contain you.

#### User configuration (1)

If you have `GRANT` rights it is possible to add, rename and delete a user and to set and reset the password.
If you have `CHANGE` rights it is still possible to set and reset your own password.

#### Access rules (2)

If you have `GRANT` rights it is possible to modify the [access rules](https://docs.thingsdb.net/v1/thingsdb-api/grant/) of yourself and others. The access rules are specific for every [scope](https://docs.thingsdb.net/v1/overview/scopes/), including the different collections and nodes. For example it is possible to grant someone `CHANGE` rights to one specific collection only, and exclude the user from other ones.

#### Tokens (3)

If you have `CHANGE` rights it is possible to add and delete your own access tokens. You need `GRANT` rights to do this for other users.

### Procedures

<img src="readme/img/procedure.png?" alt="alt Login" style="zoom:70%;" />

Procedures can be used in in the `@collection` and `@thingsdb` scopes. Here you find the procedures in the `@thingsdb` scope.

### Tasks

<img src="readme/img/task.png?" alt="alt Login" style="zoom:70%;" />

Tasks can be used in in the `@collection` and `@thingsdb` scopes. Here you find the tasks in the `@thingsdb` scope.


### Nodes

<img src="readme/img/nodes.png?" alt="alt Login" style="zoom:70%;" />

The [nodes](https://docs.thingsdb.net/v1/node-api/) can be found in the side panel. The side panel can be dragged left and right if needed.



#### Node configuration

In this panel you can add a new node, view the stream graph (which shows how the nodes are connected to each other), and [restore](https://docs.thingsdb.net/v1/thingsdb-api/restore/) from a backup file.

When expanding one node in the table, you will find a couple of tabs __NODE INFO__, __COUNTERS__,  __BACKUP__, and __MODULES__. The last two will be explained in the next paragraphs.

Clicking __NODE INFO__ presents you with quite a lot of information like e.g. uptime, log level, ports and versioning. Under this tab you find also the possibility to change the [log level](https://docs.thingsdb.net/v1/node-api/set_log_level/) or [shutdown](https://docs.thingsdb.net/v1/node-api/shutdown/) a node.

Clicking __COUNTERS__ will show some basic information about queries, garbage collection and [changes](https://docs.thingsdb.net/v1/overview/changes/). You can reset these counters if needed.



#### Backup

<img src="readme/img/nodes_backup.png?" alt="alt Login" style="zoom:70%;" />

Under the __BACKUP__ tab you can add and remove [backups](https://docs.thingsdb.net/v1/node-api/), as well as find all the backup schedule information for that particular node.

Backups are created using tar and gzip. Once a backup is made, the .tar.gz backup file can be used to recover ThingsDB, or can be used to load ThingsDB into another node. To schedule a [new backup](https://docs.thingsdb.net/v1/node-api/new_backup/) for a node you need to provide a file template that ends with `.tar.gz` such as `/tmp/example.tar.gz`. It is optional to set a start time. If no time is given the backup will start as soon as possible. It is also possible to set a repeat interval. If no repeat interval is set the backup will run only once.

Under `result code` and `result message` you can find out if a backup went successful.

---

Note: At least two nodes are required to create a new backup schedule, because ThingsDB needs to enter AWAY mode to actually create the backup and this happens only with two or more nodes.

---

#### Modules

<img src="readme/img/nodes_modules.png?" alt="alt Login" style="zoom:70%;" />

Under the __MODULES__ tab you can add, edit, restart and remove [modules](https://docs.thingsdb.net/v1/modules/), as well as find all the module information for that particular node. A module is a piece of software that can interact with ThingsDB. For example you can use a particular module that lets ThingsDB communicate with another database, like a time series database. Check out these [examples](https://github.com/thingsdb/ThingsDB/tree/master/modules) if you want to build your own modules.

---

### Editor

The editor provides a way to interact with ThingsDB on a more lower level. ThingsDB has its own native language. Therefore you can choose to code instead of using the graphical interface and build scripts that do a bunch of things. It is even possible to store these scripts in a procedure that you can reuse. To help a bit with learning the language, the graphical interface of ThingsGUI often displays the query that goes along with a basic action. [ThingsDocs](https://docs.thingsdb.net/v1/) informs you about all the functionality.

Next to the editor you find the __SCOPES__ panel where you can change the [scope](https://docs.thingsdb.net/v1/overview/scopes/) to the one you need before sending the query. ThingsDB has three main scopes: `@thingsdb`, `@node` and `@collection`. Where the collection and node scope are subdivided. The format of a specific collection scope is `@collection:collection_name` and for a node it is `@node:node_id`, e.g. `@collection:stuff`, `@node:0`.

Depending on the selected scope you may also see a __PROCEDURES__, __TASKS__, __TYPES__ and __ENUMS__ panel.

<img src="readme/img/editor.png?" alt="alt Login" style="zoom:70%;" />

In the bottom you also find a tab __ARGUMENTS__. Here you can add the arguments your scripts needs, so you don't need to change your script.

<img src="readme/img/editor_arguments.png?" alt="alt Login" style="zoom:70%;" />
---

Note:

* Hitting `Ctrl+Enter` will send the request as well as clicking the __SUBMIT__ button.
* The output can be displayed in either the __THINGS TREE__ view or in plain __JSON__ text.
* It is also possible to work with temporary [variables](https://docs.thingsdb.net/v1/overview/variable/). A variable can be created with `QUERY` privileges since this does not create a change.

---