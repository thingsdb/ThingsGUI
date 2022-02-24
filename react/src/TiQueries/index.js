import { NIL } from '../Constants/ThingTypes';

export const ANGLE_BRACKETS_QUERY = (content='') => `<${content}>`; // don't place a `;`
export const CLOSURE_QUERY = (args, body) => `|${args}|${body}`; // don't place a `;`
export const CURLY_BRACKETS_QUERY = (content='') => `{${content}}`; // don't place a `;`
export const CUSTOM_TYPE_LITERAL = (type, content='') => `${type}{${content}}`; // don't place a `;`
export const DATETIME_QUERY = (thing) => `datetime('${thing}')`; // don't place a `;`
export const REGEX_QUERY = (content) => `/${content}/`; // don't place a `;`
export const ROOM_QUERY = (id) => `room(${id})`; // don't place a `;`
export const RUN_QUERY = (name, args) => `run('${name}',${args})`; // don't place a `;`
export const SET_QUERY = (list) => `set(${list})`; // don't place a `;`
export const SQUARE_BRACKETS_QUERY = (content='') => `[${content}]`; // don't place a `;`
export const STRING_QUERY = (content='') => `'${content}'`; // don't place a `;`
export const THING_QUERY = (id) => `thing(${id ? id : '.id()'})`; // don't place a `;`
export const TIMEVAL_QUERY = (thing) => `timeval(${thing})`; // don't place a `;`
export const WSE_QUERY = (run) => `wse(${run})`; // don't place a `;`

export const EXPORT_QUERY = 'export();';

// Types
export const DEL_TYPE_QUERY = (name) => `del_type('${name}');`;
export const MOD_TYPE_ADD_FIELD_QUERY = (type, name, definition, init) => `mod_type('${type}', 'add', '${name}', '${definition}'${init ? `, ${init}` : ''});`;
export const MOD_TYPE_ADD_METHOD_QUERY = (type, name, closure) => `mod_type('${type}', 'add', '${name}', ${closure});`;
export const MOD_TYPE_DEL_QUERY = (type, name) => `mod_type('${type}', 'del', '${name}');`;
export const MOD_TYPE_MOD_FIELD_QUERY = (type, name, definition, callback) => `mod_type('${type}', 'mod', '${name}', '${definition}'${callback ? `, ${callback}` : ''});`;
export const MOD_TYPE_MOD_QUERY= (type, name, closure, callback) => `mod_type('${type}', 'mod', '${name}', ${closure}${callback ? `, ${callback}` : ''});`;
export const MOD_TYPE_REL_ADD_QUERY = (type, name, to) => `mod_type('${type}', 'rel', '${name}', '${to}');`;
export const MOD_TYPE_REL_DEL_QUERY = (type, name) => `mod_type('${type}', 'rel', '${name}', nil);`;
export const MOD_TYPE_REN_QUERY = (type, name, to) => `mod_type('${type}', 'ren', '${name}', '${to}');`;
export const MOD_TYPE_WPO_QUERY = (type, mode) => `mod_type('${type}', 'wpo', ${mode});`;
export const RENAME_TYPE_QUERY = (current, newName) => `rename_type('${current}', '${newName}');`;
export const SET_TYPE_EMPTY_QUERY = 'set_type("...", {...});';
export const SET_TYPE_QUERY = (type, value) => `set_type("${type}", ${value});`;
export const TYPES_INFO_QUERY = 'types_info();';

// enums
export const DEL_ENUM_QUERY = (name) => `del_enum('${name}');`;
export const ENUMS_INFO_QUERY = 'enums_info();';
export const MOD_ENUM_ADD_QUERY = (enum_, name, value) => `mod_enum('${enum_}', 'add', '${name}', ${value});`;
export const MOD_ENUM_DEF_QUERY = (enum_, name) => `mod_enum('${enum_}', 'def', '${name}');`;
export const MOD_ENUM_DEL_QUERY = (enum_, name) => `mod_enum('${enum_}', 'del', '${name}');`;
export const MOD_ENUM_MOD_QUERY = (enum_, name, value) => `mod_enum('${enum_}', 'mod', '${name}', ${value});`;
export const MOD_ENUM_REN_QUERY = (enum_, name, to) => `mod_enum('${enum_}', 'ren', '${name}', '${to}');`;
export const RENAME_ENUM_QUERY = (current, newName) => `rename_enum('${current}', '${newName}');`;
export const SET_ENUM_EMPTY_QUERY = 'set_enum("...", {...});';
export const SET_ENUM_QUERY = (enum_, members) => `set_enum("${enum_}", ${members});`;

// things
export const THING_LIST_DEL_QUERY = (id, name, index) => `thing(${id}).${name}.splice(${index}, 1);`;
export const THING_LIST_EDIT_QUERY = (id, name, index, value) => `thing(${id}).${name}[${index}] = ${value};`;
export const THING_LIST_PUSH_QUERY = (id, name, value) => `thing(${id}).${name}.push(${value});`;
export const THING_PROP_DEL_QUERY = (id, name) => `thing(${id}).del('${name}');`;
export const THING_PROP_EDIT_QUERY = (id, name, value) => `thing(${id}).${name} = ${value};`;
export const THING_PROP_QUERY = (id, name) => `thing(${id}).${name};`;
export const THING_STAT_QUERY = (id) => `thing(${id ? id : '.id()'});`;
export const THING_SET_ADD_QUERY = (id, name, value) => `thing(${id}).${name}.add(${value});`;
export const THING_SET_REMOVE_QUERY = (pid, name, cid) => `thing(${pid}).${name}.remove(thing(${cid}));`;

// check types
export const TYPE_INFO_CHILD_THING_QUERY = (cid, pid, name) => `[type(thing(${cid})), type(thing(${pid}).${name}), types_info()];`;
export const TYPE_INFO_ELSE_QUERY = (pid, pname, cname) => `[type(thing(${pid}).${cname}), type(thing(${pid}).${pname}), types_info()];`;
export const TYPE_INFO_PARENT_THING_QUERY = (id, name) => `[type(thing(${id}).${name}), type(thing(${id})), types_info()];`;
export const TYPE_INFO_ROOT_THING_QUERY = (id) => `[type(thing(${id})), '', types_info()];`; // child type, parent type, custom types

// procedures
export const DEL_PROCEDURE_QUERY = (name) => `del_procedure('${name}');`;
export const EDIT_PROCEDURE_QUERY = (name, closure) => `del_procedure('${name}'); new_procedure('${name}', ${closure});`;
export const NEW_PROCEDURE_EMPTY_QUERY = 'new_procedure("", );';
export const NEW_PROCEDURE_QUERY = (name, closure) => `new_procedure('${name}', ${closure});`;
export const PROCEDURE_INFO_QUERY = 'procedure_info();';
export const PROCEDURES_INFO_QUERY = 'procedures_info();';
export const RENAME_PROCEDURE_QUERY = (current, newName) => `rename_procedure('${current}', '${newName}');`;

// tasks
export const NEW_TASK_EMPTY_QUERY = (args) => `task(${args});`;
export const NEW_TASK_QUERY = (start, closure, args) => `task(datetime(${start}), ${closure}${args.length ? `, [${args}]`: ''});`;
export const TASK_EMPTY_QUERY = 'task();';
export const TASK_QUERY = (id) => `task(${id});`;
export const TASK_SET_ARGS_QUERY = (id, args) => `task(${id}).set_args([${args}]);`;
export const TASK_SET_CLOSURE_QUERY = (id, closure) => ` task(${id}).set_closure(${closure});`;
export const TASK_SET_OWNER_QUERY = (id, owner) => ` task(${id}).set_owner('${owner}');`;

export const GET_TASK_QUERY = (id) => `t = task(${id}); [t.id(), t.at(), t.owner(), t.closure(), t.err(), t.args()];`;
export const LIGHT_TASKS_QUERY = 'tasks = tasks(); return tasks.map(|t| {id: t.id(), at: t.at(), err: t.err()});';
export const TASK_ARGS_QUERY = (id) => `task(${id}).args();`;
export const TASK_CANCEL_QUERY = (id) => `task(${id}).cancel();`;
export const TASK_DEL_QUERY = (id) => `task(${id}).del();`;
export const TASK_OWNER_QUERY = (id) => `task(${id}).owner();`;

// error
export const ERROR_OUPUT_QUERY = (id, name) => `err = thing(${id}).${name}; [err.code(), err.msg()];`;
export const ERROR_QUERY = (code, msg) => `err(${code}${msg ? `, '${msg}'` : ''})`;

// nodes
export const BACKUPS_INFO_QUERY = 'backups_info();';
export const COUNTERS_QUERY = 'counters();';
export const DEL_BACKUP_QUERY = (id, deleteFiles) => `del_backup(${id}, ${deleteFiles});`;
export const DEL_MODULE_QUERY = (name) => `del_module('${name}');`;
export const DEL_NODE_QUERY = (id) => `del_node(${id});`;
export const MODULE_INFO_QUERY = (name) => `module_info('${name}');`;
export const MODULES_INFO_QUERY = 'modules_info();';
export const NEW_BACKUP_QUERY = (file, time, repeat, maxFiles) => `new_backup('${file}'${time ? `, datetime(${time})` : ', now()'}${repeat ? `, ${repeat}${maxFiles ? `, ${maxFiles}` : ''}` : ''});`;
export const NEW_MODULE_QUERY = (name, file, configuration) => `new_module('${name}', '${file}'${configuration ? `, ${configuration}` : ''});`;
export const NEW_NODE_QUERY = (secret, name, port) => `new_node('${secret}', '${name}'${port ? `, ${port}` : ''});`;
export const NODE_COUNTERS_INFO_QUERY = '[node_info(), counters()];';
export const NODE_INFO_QUERY = 'node_info();';
export const NODES_INFO_QUERY = 'nodes_info();';
export const NODES_NODE_INFO_QUERY = '[nodes_info(), node_info()];';
export const RENAME_MODULE_QUERY = (current, newName) =>  `rename_module('${current}', '${newName}');`;
export const RESET_COUNTERS_QUERY = 'reset_counters();';
export const RESTART_MODULE_QUERY = (name) => `restart_module('${name}');`;
export const RESTORE_QUERY = (fileName, takeAccess) => `restore('${fileName}', ${takeAccess});`;
export const SET_LOG_LEVEL_QUERY = (level) => `set_log_level(${level});`;
export const SET_MODULE_CONF_QUERY = (name, configuration) =>  `set_module_conf('${name}', ${configuration ? `${configuration}` : NIL});`;
export const SET_MODULE_SCOPE_QUERY = (name, scope) => `set_module_scope('${name}', ${scope ? `'${scope}'` : NIL});`;
export const SHUTDOWN_QUERY = 'shutdown();';

// collections
export const COLLECTION_INFO_QUERY = 'collection_info();';
export const COLLECTIONS_INFO_QUERY = 'collections_info();';
export const DEL_COLLECTION_QUERY = (name) => `del_collection('${name}');`;
export const NEW_COLLECTION_QUERY = (name) => `new_collection('${name}');`;
export const RENAME_COLLECTION_QUERY = (current, newName) => `rename_collection('${current}', '${newName}');`;

export const COLLECTIONS_USER_INFO_QUERY = '[collections_info(), user_info()];';
export const COLLECTIONS_USERS_INFO_QUERY = '[collections_info(), users_info()];';

// users
export const DEL_EXPIRED_QUERY = 'del_expired();';
export const DEL_TOKEN_QUERY = (key) => `del_token('${key}');`;
export const DEL_USER_QUERY = (name) => `del_user('${name}');`;
export const GRANT_QUERY = (collection, name, access) => `grant('${collection}', '${name}', ${access});`;
export const INFO_QUERY = (name) => `${name}_info();`;
export const NEW_TOKEN_QUERY = (name, expirationTime, description) => `new_token('${name}', expiration_time=${expirationTime || NIL}, description='${description || ''}');`;
export const NEW_USER_QUERY = (name) => `new_user('${name}');`;
export const RENAME_USER_QUERY = (current, newName) => `rename_user('${current}', '${newName}');`;
export const REVOKE_QUERY = (collection, name, access) => `revoke('${collection}', '${name}', ${access});`;
export const SET_PASSWORD_QUERY = (name, password) => `set_password('${name}', '${password}');`;
export const RESET_PASSWORD_QUERY = (name) => `set_password('${name}', ${NIL});`;
export const USER_INFO_QUERY = 'user_info();';
export const USERS_INFO_QUERY = 'users_info();';
