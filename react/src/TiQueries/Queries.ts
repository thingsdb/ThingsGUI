export const ANGLE_BRACKETS_FORMAT_QUERY = (content='') => `<${content}>`; // don't place a `;`
export const CLOSURE_FORMAT_QUERY = (args: string[], body: string) => `|${args}|${body}`; // don't place a `;`
export const CURLY_BRACKETS_FORMAT_QUERY = (content: any='') => `{${content}}`; // don't place a `;`
export const CUSTOM_TYPE_FORMAT_QUERY = (type: string, content='') => `${type}{${content}}`; // don't place a `;`
export const DATETIME_FORMAT_QUERY = (thing: string) => `datetime('${thing}')`; // don't place a `;`
export const REGEX_FORMAT_QUERY = (content: string) => `/${content}/`; // don't place a `;`
export const ROOM_FORMAT_QUERY = (id: number) => `room(${id})`; // don't place a `;`
export const RUN_FORMAT_QUERY = (name: string, args: string[]) => `run('${name}',${args})`; // don't place a `;`
export const SET_FORMAT_QUERY = (list: string) => `set(${list})`; // don't place a `;`
export const SQUARE_BRACKETS_FORMAT_QUERY = (content: any='') => `[${content}]`; // don't place a `;`
export const STRING_FORMAT_QUERY = (content='') => `'${content}'`; // don't place a `;`
export const THING_FORMAT_QUERY = (id: number | string) => `thing(${id ? id : '.id()'})`; // don't place a `;`
export const TIMEVAL_FORMAT_QUERY = (thing: string) => `timeval(${thing})`; // don't place a `;`
export const WSE_FORMAT_QUERY = (run: string) => `wse(${run})`; // don't place a `;`
export const ERROR_FORMAT_QUERY = (code: string, msg: string) => `err(${code}${msg ? `, '${msg}'` : ''})`; // don't place a `;`

export const EXPORT_QUERY = 'export();';
export const EXPORT_DUMP_QUERY = 'export({dump: true});';

// Types
export const DEL_TYPE_QUERY = 'del_type(name);';
export const MOD_TYPE_ADD_FIELD_QUERY = (init: any) => init ? 'mod_type(type, \'add\', name, definition, init);' : 'mod_type(type, \'add\', name, definition);';
export const MOD_TYPE_ADD_METHOD_QUERY = 'mod_type(type, \'add\', name, closure(closure));';
export const MOD_TYPE_DEL_QUERY = 'mod_type(type, \'del\', name);';
export const MOD_TYPE_MOD_FIELD_QUERY = (callback: any) => callback ? 'mod_type(type, \'mod\', name, definition, closure(callback));' : 'mod_type(type, \'mod\', name, definition);';
export const MOD_TYPE_MOD_QUERY = (callback: any) => callback ? 'mod_type(type, \'mod\', name, closure(closure), closure(callback));' : 'mod_type(type, \'mod\', name, closure(closure));';
export const MOD_TYPE_REL_ADD_QUERY = 'mod_type(type, \'rel\', name, to);';
export const MOD_TYPE_REL_DEL_QUERY = 'mod_type(type, \'rel\', name, nil);';
export const MOD_TYPE_REN_QUERY = 'mod_type(type, \'ren\', name, to);';
export const MOD_TYPE_WPO_QUERY = 'mod_type(type, \'wpo\', mode);';
export const RENAME_TYPE_QUERY = 'rename_type(current, newName);';
export const SET_TYPE_EMPTY_QUERY = 'set_type("...", {...});';
export const SET_TYPE_QUERY = (value: string) => `set_type(type, ${value});`;
export const TYPES_INFO_QUERY = 'types_info();';

export const MOD_TYPE_ADD_FIELD_FORMAT_QUERY = (type: string, name: string, definition: string, init: string) => `mod_type('${type}', 'add', '${name}', '${definition}'${init ? `, ${init}` : ''});`;
export const MOD_TYPE_ADD_METHOD_FORMAT_QUERY = (type: string, name: string, closure: string) => `mod_type('${type}', 'add', '${name}', '${closure}');`;
export const MOD_TYPE_DEL_FORMAT_QUERY = (type: string, name: string) => `mod_type('${type}', 'del', '${name}');`;
export const MOD_TYPE_MOD_FIELD_FORMAT_QUERY = (type: string, name: string, definition: string, callback: string) => `mod_type('${type}', 'mod', '${name}', '${definition}'${callback ? `, '${callback}'` : ''});`;
export const MOD_TYPE_MOD_FORMAT_QUERY = (type: string, name: string, closure: string, callback: string) => `mod_type('${type}', 'mod', '${name}', '${closure}'${callback ? `, '${callback}'` : ''});`;
export const MOD_TYPE_REL_ADD_FORMAT_QUERY = (type: string, name: string, to: string) => `mod_type('${type}', 'rel', '${name}', '${to}');`;
export const MOD_TYPE_REL_DEL_FORMAT_QUERY = (type: string, name: string) => `mod_type('${type}', 'rel', '${name}', nil);`;
export const MOD_TYPE_REN_FORMAT_QUERY = (type: string, name: string, to: string) => `mod_type('${type}', 'ren', '${name}', '${to}');`;
export const MOD_TYPE_WPO_FORMAT_QUERY = (type: string, mode: boolean) => `mod_type('${type}', 'wpo', ${mode});`;
export const SET_TYPE_FORMAT_QUERY = (type: string, value: string) => `set_type('${type}', ${value});`;

// enums
export const DEL_ENUM_QUERY = 'del_enum(name);';
export const ENUMS_INFO_QUERY = 'enums_info();';
export const MOD_ENUM_ADD_QUERY = 'mod_enum(enum_, \'add\', name, value);';
export const MOD_ENUM_DEF_QUERY = 'mod_enum(enum_, \'def\', name);';
export const MOD_ENUM_DEL_QUERY = 'mod_enum(enum_, \'del\', name);';
export const MOD_ENUM_MOD_QUERY = 'mod_enum(enum_, \'mod\', name, value);';
export const MOD_ENUM_REN_QUERY = 'mod_enum(enum_, \'ren\', name, to);';
export const RENAME_ENUM_QUERY = 'rename_enum(current, newName);';
export const SET_ENUM_EMPTY_QUERY = 'set_enum("...", {...});';
export const SET_ENUM_QUERY = 'set_enum(enum_, members);';

export const MOD_ENUM_ADD_FORMAT_QUERY = (enum_: string, name: string, value: string) => `mod_enum('${enum_}', 'add', '${name}', ${value});`;
export const MOD_ENUM_DEF_FORMAT_QUERY = (enum_: string, name: string) => `mod_enum('${enum_}', 'def', '${name}');`;
export const MOD_ENUM_DEL_FORMAT_QUERY = (enum_: string, name: string) => `mod_enum('${enum_}', 'del', '${name}');`;
export const MOD_ENUM_MOD_FORMAT_QUERY = (enum_: string, name: string, value: string) => `mod_enum('${enum_}', 'mod', '${name}', ${value});`;
export const MOD_ENUM_REN_FORMAT_QUERY = (enum_: string, name: string, to: string) => `mod_enum('${enum_}', 'ren', '${name}', '${to}');`;
export const SET_ENUM_FORMAT_QUERY = (enum_: string, members: string) => `set_enum("${enum_}", ${members});`;

// things - general
export const THING_CURRENT_QUERY = 'thing(.id());';
export const THING_PROP_FORMAT_QUERY = (id: number, name: string) => `thing(${id}).${name};`;
export const THING_QUERY = 'thing(id);';

// things - del
export const THING_LIST_DEL_QUERY = 'thing(id).get(name).splice(index, 1); thing(id);';
export const THING_PROP_DEL_QUERY = 'thing(id).del(name); thing(id);';
export const THING_SET_REMOVE_QUERY = 'thing(pid).get(name).remove(thing(cid)); thing(pid);';
export const THING_LIST_DEL_FORMAT_QUERY = (id: number, name: string, index: number) => `thing(${id}).${name}.splice(${index}, 1);`;
export const THING_PROP_DEL_FORMAT_QUERY = (id: number, name: string) => `thing(${id}).del('${name}');`;
export const THING_SET_REMOVE_FORMAT_QUERY = (pid: number, name: string, cid: number) => `thing(${pid}).${name}.remove(thing(${cid}));`;

// things - edit
export const THING_LIST_EDIT_FORMAT_QUERY = (id: number, name: string, index: number, value: string) => `thing(${id}).${name}[${index}] = ${value};`;
export const THING_LIST_PUSH_FORMAT_QUERY = (id: number, name: string, value: string) => `thing(${id}).${name}.push(${value});`;
export const THING_PROP_EDIT_FORMAT_QUERY = (id: number, name: string, value: string) => `thing(${id}).${name} = ${value};`;
export const THING_SET_ADD_FORMAT_QUERY = (id: number, name: string, value: string) => `thing(${id}).${name}.add(${value});`;

// check types
export const TYPE_INFO_CHILD_THING_QUERY = '[type(thing(cid)), type(thing(pid).get(name)), types_info()];';
export const TYPE_INFO_CHILD_ARRAY_QUERY = '[type(thing(pid).get(pname)[cindex]), type(thing(pid).get(pname)), types_info()];';
export const TYPE_INFO_PARENT_ARRAY_QUERY = '[type(thing(pid).get(pname)[pindex][cindex]), type(thing(pid).get(pname)[pindex]), types_info()];';
export const TYPE_INFO_PARENT_THING_QUERY = '[type(thing(id).get(name)), type(thing(id)), types_info()];';
export const TYPE_INFO_ROOT_THING_QUERY = '[type(thing(id)), "", types_info()];'; // child type, parent type, custom types

// procedures
export const DEL_PROCEDURE_QUERY = 'del_procedure(name);';
export const EDIT_PROCEDURE_QUERY = 'del_procedure(name); new_procedure(name, closure(closure));';
export const NEW_PROCEDURE_EMPTY_QUERY = 'new_procedure("", );';
export const NEW_PROCEDURE_QUERY = 'new_procedure(name, closure(closure));';
export const NEW_PROCEDURE_FORMAT_QUERY = (name: string, closure: string) => `new_procedure('${name}', '${closure}');`;
export const PROCEDURE_INFO_QUERY = 'procedure_info();';
export const PROCEDURES_INFO_QUERY = 'procedures_info();';
export const RENAME_PROCEDURE_QUERY = 'rename_procedure(current, newName);';

// tasks
export const NEW_TASK_EMPTY_QUERY = (args: string) => `task(${args});`;
export const NEW_TASK_FORMAT_QUERY = (start: number, closure: string, args: string | string[]) => `task(datetime(${start}), ${closure}${args.length ? `, ${args}`: ''});`;
export const NEW_TASK_QUERY = 'task(datetime(start), closure(closure), args);';
export const TASK_EMPTY_QUERY = 'task();';
export const TASK_FORMAT_QUERY = (id: number) => `task(${id});`;
export const TASK_SET_ARGS_QUERY = 'task(id).set_args(args);';
export const TASK_SET_CLOSURE_QUERY = 'task(id).set_closure(closure(closure));';
export const TASK_SET_OWNER_QUERY = 'task(id).set_owner(owner);';

export const GET_TASK_QUERY = 't = task(id); [t.id(), t.at(), t.owner(), t.closure(), t.err(), t.args()];';
export const LIGHT_TASKS_QUERY = 'tasks().map(|t| {id: t.id(), at: t.at(), err: t.err()});';
export const TASK_ARGS_QUERY = 'task(id).args();';
export const TASK_CANCEL_QUERY = 'task(id).cancel();';
export const TASK_DEL_QUERY = 'task(id).del();';
export const TASK_OWNER_QUERY = 'task(id).owner();';

// error
export const ERROR_OUPUT_QUERY = 'err = thing(id).get(name); [err.code(), err.msg()];';

// nodes
export const BACKUPS_INFO_QUERY = 'backups_info();';
export const COUNTERS_QUERY = 'counters();';
export const DEL_BACKUP_QUERY = 'del_backup(id, deleteFiles);';
export const DEL_MODULE_QUERY = 'del_module(name);';
export const DEL_NODE_QUERY = 'del_node(id);';
export const MODULE_INFO_QUERY = 'module_info(name);';
export const MODULES_INFO_QUERY = 'modules_info();';
export const NEW_BACKUP_QUERY = (time: string, repeat: string, maxFiles: number) => `new_backup(file${time ? ', datetime(time)' : ', timeval()'}${repeat ? `, repeat${maxFiles ? ', maxFiles' : ''}` : ''});`;
export const NEW_MODULE_QUERY = (configuration: string) => configuration ? 'new_module(name, source, configuration);' : 'new_module(name, source);';
export const NEW_NODE_QUERY = (port: number) => port ? 'new_node(secret, name, port);' : 'new_node(secret, name);';
export const NODE_COUNTERS_INFO_QUERY = '[node_info(), counters()];';
export const NODE_INFO_QUERY = 'node_info();';
export const NODES_INFO_QUERY = 'nodes_info();';
export const NODES_NODE_INFO_QUERY = '[nodes_info(), node_info()];';
export const RENAME_MODULE_QUERY = 'rename_module(current, newName);';
export const RESET_COUNTERS_QUERY = 'reset_counters();';
export const RESTART_MODULE_QUERY = 'restart_module(name);';
export const RESTORE_QUERY = (takeAccess: boolean, restoreTasks: boolean) => `restore(fileName${takeAccess || restoreTasks ? ', {take_access: takeAccess, restore_tasks: restoreTasks}' : ''});`;
export const SET_LOG_LEVEL_QUERY = 'set_log_level(level);';
export const SET_MODULE_CONF_QUERY = 'set_module_conf(name, configuration=configuration);';
export const SET_MODULE_SCOPE_QUERY = 'set_module_scope(name, scope=scope);';
export const SHUTDOWN_QUERY = 'shutdown();';

// collections
export const COLLECTION_INFO_QUERY = 'collection_info();';
export const COLLECTIONS_INFO_QUERY = 'collections_info();';
export const DEL_COLLECTION_QUERY = 'del_collection(name);';
export const NEW_COLLECTION_QUERY = 'new_collection(name);';
export const RENAME_COLLECTION_QUERY = 'rename_collection(current, newName);';

export const COLLECTIONS_USER_INFO_QUERY = '[collections_info(), user_info()];';
export const COLLECTIONS_USERS_INFO_QUERY = '[collections_info(), users_info()];';

// users
export const DEL_EXPIRED_QUERY = 'del_expired();';
export const DEL_TOKEN_QUERY = 'del_token(key);';
export const DEL_USER_QUERY = 'del_user(name);';
export const GRANT_QUERY = 'grant(collection, name, access);';
export const INFO_QUERY = (name: string) => `${name}_info();`;
export const NEW_TOKEN_QUERY = (description: string) => description ? 'new_token(name, expirationTime, description);' : 'new_token(name, expirationTime);';
export const NEW_USER_QUERY = 'new_user(name);';
export const RENAME_USER_QUERY = 'rename_user(current, newName);';
export const REVOKE_QUERY = 'revoke(collection, name, access);';
export const SET_PASSWORD_QUERY = 'set_password(name, password);';
export const USER_INFO_QUERY = 'user_info();';
export const USERS_INFO_QUERY = 'users_info();';
