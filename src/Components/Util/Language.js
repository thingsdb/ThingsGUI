export default {
    types: {
        bytes: {
            'len': 'Returns the length of the bytes value.',
        },
        closure: {
            'call': 'Call a closure.',
            'def': 'Returns the closure definition using spaces, line-breaks and indentation (4 spaces).',
            'doc': 'Returns a doc string from a closure. An empty string ("") is returned if the closure has no doc string.'
        },
        datetime: {
            'extract': 'Return a thing with second, minute, hour, day, month, year and gmt_offset as individual properties.',
            'format': 'Returns a string representation for a datetime object using a custom format.',
            'move': 'Return a new datetime (or timeval) object, which is shifted in time relative to the original date/time.',
            'replace': 'Return a new datetime (or timeval) object with altered properties. The new properties must be given by a thing.',
            'to': 'Return a new datetime (or timeval) object with new time zone information. Note that the proper time does not change, only the time zone will change.',
            'week': 'Return the week of the year as an integer between 0..53. Week 1 starts at the first Sunday in January.',
            'weekday':'Return the number of days (0..6) since the last Sunday.',
            'yday': 'Return the day in the year as an integer value between 0..365 where the first of January is day 0.',
            'zone': 'Return zone information as a string about the datetime (or timeval) object. If no zone information is available, nil will be returned.',
        },
        enum: {
            'name': 'Return the name of the enum member.',
            'value': 'Return the value of the enum member.',
        },
        error: {
            'code': 'Returns the error code of an error type.',
            'msg': 'Returns the error message of an error type.',
        },
        future: {
            'then': 'Function then accepts a closure as argument which will be executed only when the future is successful. The code inside the closure will only generate an event then the closure code is executed. The return value of the closure will be used as the new future value. The closure will be called with the same arguments as given to the future, except for the first argument, which can be the result of a module.',
            'else': 'Function else accepts a closure as argument which will be executed only when the future is using a module which has failed with some error. The code inside the closure will only generate an event then the closure code is executed. The return value of the closure will be used as the new future value. The closure will be called with the same arguments as given to the future, except for the first argument, which is the error from the module.',
        },
        list: {
            'choice': 'This function returns a pseudo-random item from the list. The list must contain at least one item, otherwise a lookup_err() is raised.',
            'each': 'Iterate over all the items in an list or tuple. Use this functions instead of map when you are not interested in the return value.',
            'every': 'This function tests whether all elements in the array pass a given test. It returns a boolean value.',
            'extend': 'Adds a list or tuple with items to the end of a list, and returns the new length.',
            'extend_unique': 'Adds a list or tuple with items to the end of a list, and returns the new length. Only items which do not have a duplicate in the list will be added.',
            'filter': 'When this method is used on an list or tuple, a new list is returned with elements that pass the test.',
            'find': 'This function returns the value of the first element in the list or tuple that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'find_index': 'This function returns the index of the first element in a list or tuple that satisfies the callback function. Otherwise nil is returned.',
            'first':'Returns the first item in the list. A lookup_err() is raised when this function is used on an empty list unless a default value is given, in which case the given value will be returned.',
            'has':'Return true if a given value is found in the list, or false if not found.',
            'index_of': 'Returns the first index at which a given value can be found in the list or tuple, or nil if it is not present. The index of an array starts at 0, so the first item has index 0 the second 1 and so on.',
            'is_unique': 'This function determines whether each item in a list is unique or not.',
            'join': 'This function returns a new string by concatenating all items in a list or tuple. All items in the list or tuple must be of type str, otherwise a type_err() is raised.',
            'last':'Returns the last item in the list. A lookup_err() is raised when this function is used on an empty list unless a default value is given, in which case the given value will be returned.',
            'len': 'Returns the length of a list or tuple.',
            'map': 'Iterate over items in an list or tuple.',
            'pop': 'Removes the last element from a list and returns that element. This method changes the length of the list. The pop() method works on a list type array, but not on a tuple since tuples are immutable.',
            'push': 'Adds new items to the end of an list, and returns the new length',
            'reduce': 'Executes a given reducer closure on each element of the list, resulting in a single output value.',
            'remove': 'This function removes and returns the value of the first element in the list that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'reverse': 'Return a new list with the items in reverse order.',
            'shift': 'Remove the first item from a list and returns that item.',
            'some': 'This function tests whether at least one element in the array passes a given test. It returns a boolean value.',
            'sort': 'When this method is used on an list or tuple, a new sorted list is returned.',
            'splice': 'The splice() method changes the contents of an list by removing or replacing existing elements and/or adding new elements in place.',
            'unique': 'This function returns a new list where each item in the list is unique. If duplicated items are found, the first item will be retained.',
            'unshift': 'Add new items to the start of a list and returns the new length.',
        },
        mpdata: {
            'len': 'Returns the length of mpdata in bytes.',
            'load': 'Load mpdata into ThingsDB.'
        },
        regex: {
            'test': 'Test if a string matches a given regular expression and return true or false.',
        },
        set: {
            'add': 'Adds new thing to the set and returns the number of things which are actually added to the set. For example my_set.add(#42); will return 0 if my_set already contains thing #42.',
            'each': 'Iterate over items in an set.',
            'every': 'This function checks if all things in the set pass a given test. It returns a boolean value.',
            'filter': 'When this method is used on a set, then the return value will be a new set.',
            'find': 'This function returns the value of the first element in the set that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'has': 'Determines if a set has a given thing.',
            'len': 'Returns the length of a set.',
            'map': 'Iterate over items in an set.',
            'reduce': 'Executes a given reducer closure on every thing in the set, accumulating to a single return value.',
            'remove': 'This function can be used to remove things from a set. If a closure is used, then all things that satisfy the test are removed from the set and returned as list. The order of the removed things is not guaranteed since the set itself is unordered. It is also possible to specify things as arguments. In this case a list is returned with all the things which are removed from the set, in the order that the arguments are used. Things which are not found in the set are ignored.',
            'some': 'This function checks if at least one thing in the set passes a given test. It returns a boolean value.',
        },
        string: {
            'contains': 'Determines if a given string is a substring of a string.',
            'ends_with': 'Determines if a string ends with characters given by another string.',
            'len': 'Returns the length of a string.',
            'lower': 'Return a new string in which all case-based characters are in lower case.',
            'replace': 'Returns a new string in witch occurrences of a given substring are replaced with another substring.',
            'split': 'Split a string into a new list with substrings.',
            'starts_with': 'Determines if a string starts with characters given by another string.',
            'test': 'Test if a string matches a given regular expression and return true or false.',
            'trim': 'Returns a new string with whitespace characters removed from both the start and end of a string.',
            'trim_left': 'Returns a new string with whitespace characters removed from the start of a string.',
            'trim_right': 'Returns a new string with whitespace characters removed from the the end of a string.',
            'upper': 'Return a new string in which all case-based characters are in upper case.',
        },
        thing: {
            'assign': 'Copies properties from a given thing. Existing properties will be overwritten and new properties will be added. If this function is used on an instance of a custom Type, all properties of the source must be valid according the type specification, otherwise an exception will be raised and no properties will be copied.',
            'copy': 'Copy a thing to a new thing. A Type is not preserved.',
            'del': 'Delete a property from a thing.',
            'dup': 'Duplicate a thing while preserving the Type.',
            'each': 'Iterate over all properties on a thing.',
            'equals': 'Determines if a thing is equal to another thing.',
            'filter': 'When this method is used on a thing, then a new thing will be returned with only the properties that pass the test.',
            'get': 'Return the value of a property on a thing by a given property name. If the property is not found then the return value will be nil, unless an alternative return value is given.',
            'has': 'Determines if a thing has a given property.',
            'id': 'Returns the id of a thing or nil if the thing is not stored.',
            'keys': 'Returns an list with all the property names of a thing. The same could be returned using map so the following statement is true: (.keys() == .map(|k| k))',
            'len': 'Returns the number of items in a thing.',
            'map': 'Iterate over all properties on a thing.',
            'set': 'Creates a new property on a thing. If the property already existed then the old property will be overwritten. This function is equal to an assignment except that it can be used when the name of the property is dynamic.',
            'to_type': 'Converts a thing into an instance of a given Type.',
            'values': 'Returns an list with all the property values of a thing. The same could be returned using map so the following statement is true: (.values() == .map(|_, v| v))',
            'wrap': 'Wrap a thing with a Type.',
        },
        type: {
            'copy': 'Copy a thing to a new thing. A Type is not preserved.',
            'dup': 'Duplicate a thing while preserving the Type.',
            'unwrap': 'Unwrap a wrapped thing.',
        }
    },
    collection: {
        'alt_raise': 'This function will try a statement. If the statement is successful it will just return the result but in case of an error, it will re-raise the error using a given error code.',
        'assert': 'Raises ASSERTION_ERROR if the specified statement evaluates to false.',
        'base64_decode': 'Decode a Base64 encoded string.',
        'base64_encode': 'Encode a str or bytes value using Base64.',
        'bool': 'Returns an bool from a specified value. If no value is given, false is returned.',
        'bytes': 'Convert a value to a byte sequence. If no value is given, an empty byte sequence is returned.',
        'datetime': 'Returns a datetime depending on some optional values.',
        'deep': 'Returns the current deep value. The deep value might change when a function with a return(..) is called which has changed the deep value for this query.',
        'del_enum': 'Delete an enumerator.',
        'del_type': 'Deletes an existing Type. It is not possible to delete a Type which is used by another type. You should first change or delete the other type before you are able to delete this type. See the example below.',
        'enum': 'Get an enum member by value',
        'enum_info': 'Return info about the enumerator type.',
        'enums_info': 'Return info about all the enumerator types in the current scope',
        'err': 'Returns an error.',
        'event_id': 'Returns the current event ID for the running query. The return value will be nil if the query does not require an event.',
        'export': 'Returns the enums, types and procedures as a setup script. \n\n(!) Note this is an experimental function and may change in the future.',
        'float': 'Returns a float from a specified value. If no value is given, the default float 0.0 is returned. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1.0 for true and 0.0 for false.',
        'future': 'Returns a future. It is not possible to assign a future to a collection or add the future to a list. If you do, then nil will be assigned instead.',
        'has_enum': 'Determine if the current scope has a given enumerator type',
        'has_type': 'Determines if a Type exists in the current @collection scope.',
        'if': 'Runs a block code based on the result of a given condition.',
        'int': 'Returns an int from a specified value. If no value is given, the default integer 0 is returned. If the specified value was a float value, then the new integer value will be rounded towards zero. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1 for true and 0 for false.',
        'is_array': 'This function determines whether the value passed to this function is an array type or not. The functions is_lis_t and is_tuple can be used to check if the array is mutable.',
        'is_ascii': 'This function determines whether the value passed to this function is of type raw and contains only valid ascii characters.',
        'is_bool': 'This function determines whether the value passed to this function is a bool or not.',
        'is_bytes': 'This function determines whether the value passed to this function is of type bytes or not.',
        'is_closure': 'This function determines whether the provided value is a closure or not.',
        'is_datetime': 'This function determines whether the provided value is of type datetime.',
        'is_enum': 'Test if a given value is a member of an enumerator type',
        'is_err': 'This function determines whether the value passed to this function is a error or not.',
        'is_float': 'This function determines whether the value passed to this function is a floating point value or not.',
        'is_future': 'This function determines whether the provided value is a future value or not.',
        'is_mpdata': 'This function determines whether the provided value is raw MessagePack data or not.',
        'is_inf': 'This function determines whether the provided value is a positive or negative infinity.',
        'is_int': 'This function determines whether the value passed to this function is an integer or not.',
        'is_list': 'This function determines whether the value passed to this function is a mutable array or not.',
        'is_nan': 'This function determines whether the value passed to this function is a number. Returns true is the given value is not a number, else false.',
        'is_nil': 'This function determines whether the value passed to this function is nil.',
        'is_raw': 'This function determines whether the value passed to this function is of type raw.',
        'is_regex': 'This function determines whether the provided value is of type regex or not.',
        'is_set': 'This function determines whether the value passed to this function is a set or not.',
        'is_str': 'This function determines whether the value passed to this function is of type raw and contains valid utf8. Alias for is_utf8.',
        'is_thing': 'This function determines whether the value passed to this function is a thing or not.',
        'is_timeval': 'This function determines whether the provided value is of type timeval.',
        'is_tuple': 'This function determines whether the value passed to this function is a immutable array or not. At least nested arrays are of kind tuple.',
        'is_utf8': 'This function determines whether the value passed to this function is of type raw and contains valid utf8.',
        'list': 'Returns a new empty list or returns a list for a given set.',
        'mod_enum': 'Modify an existing enumerator type',
        'mod_type': 'This function is used to modify an existing Type. A number of actions can be performed with this function.',
        'new': 'Creates a new instance of a defined Type.',
        'new_type': 'Creates a new Type. This function only creates a new type and does not allow you to specify any fields. With the set_type() function you can define the fields for the new type.',
        'now': 'Return the time in seconds since the epoch as a floating point number. If you require the same time multiple times within a query, then call now() only once and save it to a variable, for example now = now();',
        'raise': 'Raises an error.',
        'rand': 'Returns pseudo-random random number between 0.0 and 1.0.',
        'randint': 'Returns pseudo-random random integer number between a given range. The first argument specifies the start of the range and must have a value less than the second argument when specifies the end of the range. The start is inclusive and the end is exclusive, for example: randint(0, 2) will return either 0 or 1.',
        'randstr': 'Returns a string with random characters.',
        'range': 'This function returns a list of numbers, starting from 0 by default, and increments by 1 (by default), and ends at a specified number.',
        'refs': 'Returns the reference count of a value. The count returned is generally one higher than you might expect, because it includes the (temporary) reference.',
        'regex': 'This function can be used to create a regular expression from a given pattern with optional flags.',
        'rename_enum': 'Rename an enum type.',
        'rename_type': 'Rename a type.',
        'return': 'The return function moves the argument to the output of the current query/closure call. If no return is specified, then the last value will be the value which is returned. A second argument can be given to the return function which can be used to specify how deep the result should be returned. The default deep value is set to 1, but any value between 0 and 127 is possible. A query can run different procedures and/or closures which might have change the deep value. In case you need to know the current deep value, the function deep() can be used. When no arguments are used the return value will be nil.',
        'set': 'Returns a new empty set. If an array is given, then all elements in the given array must be or type thing and a new set is returned based on the given things. Instead of an array, it is also possible to provide things comma separated.',
        'set_enum': 'Create a new enumerator type',
        'set_type': 'Defines the properties of a Type. Function set_type works only on a new type. Use mod_type() if you want to change an existing type, see mod_type.',
        'str': 'Convert a value to a string. If no value is given, an empty string "" is returned. When bytes are converted to str then the data will be checked if it contains valid UTF-8 characters. If this is not the case, a VALUE_ERROR will be raised.',
        'thing': 'Returns a thing from a specified value. If no value is given, a new thing is returned.',
        'timeval': 'Returns a timeval depending on some optional values.',
        'try': 'Try a statement and if the statement fails with an error, then the error is returned. It is also possible to catch only specific errors.',
        'type': 'Returns the type name of a value.',
        'type_assert': 'Raises a type_err() if the specified expression evaluates to false.',
        'type_count': 'Returns the number of instances of a given Type within a collection.',
        'type_info': 'Returns information about a given Type.',
        'types_info': 'Returns Type information about all the types within a collection.',
        'wse': 'Stored closures which can potentially make changes to ThingsDB are called closures with side effects and must be wrapped with the wse(..) function. This allows ThingsDB before running the query to make an event. You should not wrap wse around all closures since this would unnecessary create events when they may not be required.',
    },
    errors: {
        'assert_err': 'Returns an error when an assertion has failed.',
        'auth_err': 'Returns an error when authentication has failed.',
        'bad_data_err': 'Returns an error when a request is malformed.',
        'forbidden_err': 'Returns an error when the client or user is missing the required privileges.',
        'lookup_err': 'Returns an error when a requested resource is not found or when an index is out-of-range.',
        'max_quota_err': 'Returns an error when a quota limit is reached.',
        'node_err': 'Returns an error when a node was not able to handle the request.',
        'num_arguments_err': 'Returns an error when a wrong number of arguments is given.',
        'operation_err': 'Returns an error when an operation is not valid within the current context.',
        'overflow_err': 'Returns an error when an attempt is made to create an integer value out of the supported 64Bit (signed) range.',
        'syntax_err': 'Returns an error when the given ThingsDB code contains a syntax error.',
        'type_err': 'Returns an error when a given value is of the incorrect type.',
        'value_err': 'Returns an error when a given value has the correct type but contains invalid data.',
        'cancelled_err': 'Returns an error when an operation is cancelled before completion. Fox example by a time-out or stop of service.',
        'zero_div_err': 'Returns an error when an attempt is made to divide or take a modulo by zero.',
    },
    node: {
        'backup_info': 'Returns information about a specific scheduled backup.',
        'backups_info': 'Returns backup schedule information for all backup schedules in the selected node scope.',
        'counters': 'Returns counters for the ThingsDB node you are connected too. Counters start all at zero when ThingsDB is started, or when the counters are reset by using reset_counters()’. Counters give information about things, queries and events. If you suspect failed queries, then counters might provide you with more information.',
        'del_backup': 'Delete a scheduled backup. If the schedule was pending, the backup job will be cancelled.',
        'has_backup': 'Determines if a backup exists in ThingsDB.',
        'new_backup': 'Schedule a new backup. Backups are created using tar and gzip. Once a backup is made, the .tar.gz backup file can be used to recover ThingsDB, or can be used to load the ThingsDB into another node. The result value is a backup ID. This ID can be used by backup_info(..) for details about the backup schedule job, or can be used to delete the backup schedule.',
        'node_info': 'Returns information about the connected node.',
        'nodes_info': 'Returns information about all ThingsDB nodes.',
        'reset_counters': 'Resets the counters for the ThingsDB node you are connected too. Other nodes are not affected',
        'restart_module': 'Restarts a given module.',
        'set_log_level': 'Change the log level for the node in the selected scope. ThingsDB will then log all levels greater than or equal to the specified level. For example, a default log_level of warning will log warning, error and critical messages.',
        'shutdown':'Shutdown the node in the selected scope. This is a clean shutdown, allowing all other nodes (and clients) to disconnect.',
    },
    thingsdb: {
        'collection_info': 'Returns information about a specific collection. This function requires QUERY privileges on the requested collection, or EVENT privileges on the @thingsdb scope.',
        'collections_info': 'Returns collection information for all collections in ThingsDB.',
        'del_collection': 'Delete a collection.',
        'del_expired': 'Delete all expired tokens. Extends to all users.',
        'del_module': 'Delete a module. A SIGTERM signal will be send to the process for the module which might cancel running futures.',
        'del_node': 'Delete a node from ThingsDB.',
        'del_token': 'Delete a token.',
        'del_user': 'Delete a user. It is not possible to delete your own user account and a BAD_REQUEST will be raised in case you try to. Any tokens associated with the user will also be deleted.',
        'deploy_module': 'Deploy a module on all nodes. The module must be configured first, using the new_module() function. This function is used to write the module data (or plain python code) to the module. After deploying the code, the module will be restarted on every node.',
        'grant': 'Grant collection or general privileges to a user. Access to a user is provided by setting a bit mask to either the .node scope, .thingsdb scope or a collection. Privileges to ThingsDB gives a user the ability to view counters, add, view remove users etc.',
        'has_collection': 'Determines if a collection exists in ThingsDB.',
        'has_module': 'Determines if a module exists in ThingsDB. The scope restriction of the module has no impact on the result of this function.',
        'has_node': 'Determines if a node exists in ThingsDB',
        'has_token': 'Determines if a token exists in ThingsDB.',
        'has_user': 'Determines if a user exists in ThingsDB.',
        'module_info': 'Returns information about a specific module.',
        'modules_info': 'Returns module information about all modules in ThingsDB.',
        'new_collection': 'Create a new collection.',
        'new_module': 'Configures a new module for ThingsDB.',
        'new_node': 'Adds a new node to ThingsDB. Nodes are used for scaling and high availability.',
        'new_token': 'Adds a new token for a given user. An optional expiration time may be given after which the token cannot be used anymore. Use del_expired to cleanup expired tokens. The expiration time may be given as a UNIX time-stamp in seconds or a date/time string. It is also possible to set a description for the token which can be used to identify where token is used for. If you only want to set a description, but no expiration time, then you can use nil as second argument.',
        'new_user': 'Creates a new user to ThingsDB. The new user is created without a password, token and access privileges. You probably want to set a password or add a new token and assign some privileges using grant(…).',
        'rename_collection': 'Rename a collection.',
        'rename_module': 'Rename a module.',
        'rename_user': 'Rename a user.',
        'restore': 'Restore from a backup file created with the new_backup function.',
        'revoke': 'Revoke collection or general privileges from a user. See grant for more information on how access privileges can be set for a user.',
        'set_module_conf': 'Change the module configuration. This will (re-send) the module configuration to the module. If the module was not started, ThingsDB will also auto-load the module and send the configuration. Any Value is accepted as config but value nil will not be considered as a configuration and thus will not be send to the module.',
        'set_module_scope': 'Modules can be restricted for usage in a single scope. This can be a @collection:.. scope, but also a @node or @thingsdb scope. This function can be used to change the module scope. When the scope is set to nil, the module can be used in any scope.',
        'set_password': 'Change a users password. This function can also be used to remove an existing password by using nil as the new password. Passwords must contain 1 to 128 printable characters.',
        'set_time_zone': 'By default each collection will be created with time zone UTC. This function can be used to change the time zone for a collection. If changed, the functions datetime(..) and timeval(..) will use the collections time zone unless specified otherwise.',
        'time_zones_info': 'Returns all available time zones in ThingsDB.',
        'user_info': 'Returns information about a user. If no argument is given, this method will return information about the current logged in user.',
        'users_info': 'Returns user information for all users withing ThingsDB. This function requires GRANT privileges on the .thingsdb scope since it exposes user access and token information.',
    },
    procedures: {
        'del_procedure': 'Delete a procedure.',
        'has_procedure': 'Determines if a procedure exists in the current scope.',
        'new_procedure': 'Creates a new procedure to the @thingsdb or a @collection scope. The name of the procedure must be unique within the scope. The given closure will be copied to the procedure, so this is not a reference to a given closure.',
        'procedure_doc': 'Returns the doc string for a given procedure. An empty string is returned if the procedure has no doc string.',
        'procedure_info': 'Returns procedure information for all procedures in the scope.',
        'procedures_info': 'Returns information about a procedure.',
        'rename_procedure': 'Rename a procedure.',
        'run': 'Run a procedure.',
    },
    timers: {
        'del_timer': 'Delete a timer.',
        'has_timer': 'Determines if a timer exists in the current scope.',
        'new_timer': 'Creates a new timer to the @thingsdb or a @collection scope. The given closure will be copied to the timer, so this is not a reference to the given closure.',
        'run': 'Run a timer.',
        'set_timer_args': 'Set timer arguments. If less than the required arguments are given, then the remaining arguments will be set using nil. More arguments than the closure accepts are simply removed and thus not used.',
        'timer_args': 'Get timer arguments as a tuple.',
        'timer_info': 'Returns information about a timer.',
        'timers_info': 'Returns timer information about all timers in the scope.',
    },
};
