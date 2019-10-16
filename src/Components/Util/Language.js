export default {
    types: {
        array: {
            'array': 'Returns a new empty array or returns an array for a given set.',
            'extend': 'Adds an array with items to the end of a list, and returns the new length.',
            'filter': 'If this method is used on a thing, then a new thing will be returned with only the properties that pass the test. If the method is used on an array, then a new array is returned with elements that pass the test and if used on a set, then the return value will be a new set.',
            'find': 'This function returns the value of the first element in the array or set that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'findindex': 'This function returns the index of the first element in an array that satisfies the callback function. Otherwise nil is returned.',
            'indexof': 'Returns the first index at which a given value can be found in the array, or nil if it is not present. The index of an array starts at 0, so the first item has index 0 the second 1 and so on.',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'map': 'Iterate over items in an array, set or over all properties on a thing.',
            'pop': 'Removes the last element from an array and returns that element. This method changes the length of the array. The pop() method works on a list type array, but not on a tuple since tuples are immutable.',
            'push': 'Adds new items to the end of an array, and returns the new length.',
            'remove': 'This function removes and returns the value of the first element in the array that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'splice': 'The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.',
        },
        set: {
            'add': 'Adds new thing to the set and returns the number of things which are actually added to the set. For example my_set.add( t(42) ); will return 0 if my_set already contains thing #42.',
            'filter': 'If this method is used on a thing, then a new thing will be returned with only the properties that pass the test. If the method is used on an array, then a new array is returned with elements that pass the test and if used on a set, then the return value will be a new set.',
            'find': 'This function returns the value of the first element in the array or set that satisfies the callback function. Otherwise nil is returned unless an alternative return value is specified.',
            'has': 'Determines if a set has a given thing.',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'map': 'Iterate over items in an array, set or over all properties on a thing.',
            'remove': 'This function can be used to remove things from a set. If a closure is used, then all things that satisfy the test are removed from the set and returned as list. The order of the removed things is not guaranteed since the set itself is unordered. It is also possible to specify things as arguments. In this case a list is returned with all the things which are removed from the set, in the order that the arguments are used. Things which are not found in the set are ignored.',
            'set': 'Returns a new empty set. If an array is given, then all elements in the given array must be or type thing and a new set is returned based on the given things.',
        },
        string: {
            'contains': 'Determines if a given string is a substring of a string.',
            'endswith': 'Determines if a string ends with characters given by another string.',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'lower': 'Return a new string in which all case-based characters are in lower case.',
            'startswith': 'Determines if a string starts with characters given by another string.',
            'str': 'Convert a value to a string. If no value is given, an empty string "" is returned.',
            'test': 'Test if a string matches a given regular expression and return true or false.',
            'upper': 'Return a new string in which all case-based characters are in upper case.',
        },
        thing: {
            'deep': 'Returns the current deep value. The deep value might change when a function with a return(..) is called which has changed the deep value for this query.',
            'del': 'Delete a property from a thing.',
            'filter': 'If this method is used on a thing, then a new thing will be returned with only the properties that pass the test. If the method is used on an array, then a new array is returned with elements that pass the test and if used on a set, then the return value will be a new set.',
            'get': 'Return the value of a property on a thing by a given property name. If the property is not found then the return value will be nil, unless an alternative return value is given.',
            'has': 'Determines if a thing has a given property.',
            'id': 'Returns the id of a thing or nil if the thing is not stored.',
            'keys': 'Returns an array with all the property names of a thing. The same could be returned using map so the following statement is true: (.keys() == .map(|k| k))',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'map': 'Iterate over items in an array, set or over all properties on a thing.',
            'set': 'Creates a new property on a thing. If the property already existed then the old property will be overwritten. This function is equal to an assignment except that it can be used when the name of the property is dynamic.',
            'values': 'Returns an array with all the property values of a thing. The same could be returned using map so the following statement is true:',
        },
    },
    noType: {
        'assert': 'Raises ASSERTION_ERROR if the specified statement evaluates to false.',
        'bool': 'Returns an bool from a specified value. If no value is given, false is returned.',
        'call': '',
        'err': 'Returns an error.',
        'float': 'Returns a float from a specified value. If no value is given, the default float 0.0 is returned. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1.0 for true and 0.0 for false.',

        'now': 'Return the time in seconds since the epoch as a floating point number. If you require the same time multiple times within a query, then call now() only once and save it to a variable, for example now = now();',
        'raise': 'Raises an error.',
        'return': 'The return function moves the argument to the output of the current query/closure call. If no return is specified, then the last value will be the value which is returned. A second argument can be given to the return function which can be used to specify how deep the result should be returned. The default deep value is set to 1, but any value between 0 and 127 is possible. A query can run different procedures and/or closures which might have change the deep value. In case you need to know the current deep value, the function deep() can be used. When no arguments are used the return value will be nil.',
        'thing': 'Returns a thing from a specified value. If no value is given, a new thing is returned.',
        'try': 'Try a statement and if the statement fails with an error, then the error is returned. It is also possible to catch only specific errors.',
        'wse': 'Stored closures which can potentially make changes to ThingsDB are called closures with side effects and must be wrapped with the wse(..) function. This allows ThingsDB before running the query to make an event. You should not wrap wse around all closures since this would unnecessary create events when they may not be required.',

        'int': 'Returns an int from a specified value. If no value is given, the default integer 0 is returned. If the specified value was a float value, then the new integer value will be rounded towards zero. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1 for true and 0 for false.',
        'isarray': 'This function determines whether the value passed to this function is an array type or not. The functions islist and istuple can be used to check if the array is mutable.',
        'isascii': 'This function determines whether the value passed to this function is of type raw and contains only valid ascii characters.',
        'isbool': 'This function determines whether the value passed to this function is a bool or not.',
        'iserr': 'This function determines whether the value passed to this function is a error or not.',
        'isfloat': 'This function determines whether the value passed to this function is a floating point value or not.',
        'isint': 'This function determines whether the value passed to this function is an integer or not.',
        'isinf': '',
        'islist': 'This function determines whether the value passed to this function is a mutable array or not.',
        'isnan': 'This function determines whether the value passed to this function is a number. Returns true is the given value is not a number, else false.',
        'isnil': 'This function determines whether the value passed to this function is nil.',
        'israw': 'This function determines whether the value passed to this function is of type raw.',
        'isset': 'This function determines whether the value passed to this function is a set or not.',
        'isstr': 'This function determines whether the value passed to this function is of type raw and contains valid utf8. Alias for isutf8.',
        'isthing': 'This function determines whether the value passed to this function is a thing or not.',
        'istuple': 'This function determines whether the value passed to this function is a immutable array or not. At least nested arrays are of kind tuple.',
        'isutf8': 'This function determines whether the value passed to this function is of type raw and contains valid utf8.',
        'refs': 'Returns the reference count of a value. The count returned is generally one higher than you might expect, because it includes the (temporary) reference.',
        'type': 'Returns the type name of a value.',
    },
    node: [
        'counters',
        'node_info',
        'nodes_info',
        'reset_counters',
        'set_log_level',
        'shutdown',
    ],
    thingsdb: [
        'collection_info',
        'collections_info',
        'del_collection',
        'del_expired',
        'del_token',
        'del_user',
        'grant',
        'new_collection',
        'new_node',
        'new_token',
        'new_user',
        'pop_node',
        'rename_collection',
        'rename_user',
        'replace_node',
        'revoke',
        'set_password',
        'set_quota',
        'user_info',
        'users_info',
    ],
    procedures: [
        'new_procedure',
        'del_procedure',
        'procedure_doc',
        'procedures_info',
        'procedure_info',
        'run',
    ],
    docs: {
        collection_info: ('Returns information about a specific collection.'),
        collections_info: ('?'),
        counters: (
            'Returns counters for the ThingsDB node you are connected too. Counters start all at zero when ThingsDB is started, or when the counters are reset by using reset_counters(). ' +
            'Counters give information about things, queries and events. If you suspect failed queries, then counters might provide you with more information.'
        ),
    }
};
