export default {
    types: {
        array: {
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
        },
        string: {
            'contains': 'Determines if a given string is a substring of a string.',
            'endswith': 'Determines if a string ends with characters given by another string.',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'lower': 'Return a new string in which all case-based characters are in lower case.',
            'startswith': 'Determines if a string starts with characters given by another string.',
            'test': 'Test if a string matches a given regular expression and return true or false.',
            'upper': 'Return a new string in which all case-based characters are in upper case.',
        },
        thing: {
            'del': 'Delete a property from a thing.',
            'filter': 'If this method is used on a thing, then a new thing will be returned with only the properties that pass the test. If the method is used on an array, then a new array is returned with elements that pass the test and if used on a set, then the return value will be a new set.',
            'hasprop': 'Determines if a thing has a given property.',
            'id': 'Returns the id of a thing.',
            'keys': 'Returns an array with all the property names of a thing. The same could be returned using map so the following statement is true: (.keys() == .map(|k| k))',
            'len': 'Returns the length of an array or string, or the number of items in a thing.',
            'map': 'Iterate over items in an array, set or over all properties on a thing.',
            'values': 'Returns an array with all the property values of a thing. The same could be returned using map so the following statement is true:',
        },
    },
    noType: {
        'array': 'Returns a new empty array or returns an array for a given set.',
        'assert': 'Raises ASSERTION_ERROR if the specified statement evaluates to false.',
        'call': '',
        'blob': '',
        'err': 'Returns an error.',
        'now': 'Return the time in seconds since the epoch as a floating point number. If you require the same time multiple times within a query, then call now() only once and save it to a variable, for example now = now();',
        'raise': 'Raises an error.',
        'set': 'Returns a new empty set. If an array is given, then all elements in the given array must be or type thing and a new set is returned based on the given things.',
        'thing': 'This function can be used to get a thing or multiple things by id.',
        'try': 'Try a statement and if the statement fails with an error, then the error is returned. It is also possible to catch only specific errors.',
        'wse': '',

        'bool': 'Returns an bool from a specified value. If no value is given, false is returned. Types with a length evaluate to true when the length is not 0 and false otherwise.',
        'float': 'Returns a float from a specified value. If no value is given, the default float 0.0 is returned. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1.0 for true and 0.0 for false.',
        'int': 'Returns an int from a specified value. If no value is given, the default integer 0 is returned. If the specified value was a float value, then the new integer value will be rounded towards zero. If the specified value is of type raw, then the initial characters of the string are converted until a non-digit character is found. Initial white space is ignored and the number may start with an optional + or - sign. Type bool values are converted to 1 for true and 0 for false.',
        'isarray': 'This function determines whether the value passed to this function is an array type or not. The functions islist and istuple can be used to check if the array is mutable.',
        'isascii': 'This function determines whether the value passed to this function is of type raw and contains only valid ascii characters.',
        'isbool': 'This function determines whether the value passed to this function is a bool or not.',
        'iserror': 'This function determines whether the value passed to this function is a error or not.',
        'isfloat': 'This function determines whether the value passed to this function is a floating point value or not.',
        'isint': 'This function determines whether the value passed to this function is an integer or not.',
        'isinf': '',
        'islist': 'This function determines whether the value passed to this function is a mutable array or not.',
        'isnan': 'This function determines whether the value passed to this function is a number.',
        'israw': 'This function determines whether the value passed to this function is of type raw.',
        'isset': 'This function determines whether the value passed to this function is a set or not.',
        'isstr': 'This function determines whether the value passed to this function is of type raw and contains valid utf8. Alias for isutf8.',
        'isthing': 'This function determines whether the value passed to this function is a thing or not.',
        'istuple': 'This function determines whether the value passed to this function is a immutable array or not. At least nested arrays are of kind tuple.',
        'isutf8': 'This function determines whether the value passed to this function is of type raw and contains valid utf8.',
        'refs': 'Returns the reference count of a value. The count returned is generally one higher than you might expect, because it includes the (temporary) reference.',
        'str': 'Convert a value to a string. If no value is given, an empty string "" is returned.',
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
    docs: {
        collection_info: ('Returns information about a specific collection.'),
        collections_info: ('?'),
        counters: (
            'Returns counters for the ThingsDB node you are connected too. Counters start all at zero when ThingsDB is started, or when the counters are reset by using reset_counters(). ' +
            'Counters give information about things, queries and events. If you suspect failed queries, then counters might provide you with more information.'
        ),
    }
};
