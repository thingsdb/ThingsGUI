export const CLOSURE_QUERY = (args, body) => `|${args}|${body}`; // don't place a `;`
export const DATETIME_QUERY = (thing) => `datetime('${thing}')`; // don't place a `;`
export const EXPORT_QUERY = 'export();';
export const ROOM_QUERY = (id) => `room(${id})`; // don't place a `;`
export const RUN_QUERY = (name, args) => `run('${name}',${args})`; // don't place a `;`
export const SET_QUERY = (list) => `set(${list})`; // don't place a `;`
export const TIMEVAL_QUERY = (thing) => `timeval(${thing})`; // don't place a `;`
export const WSE_QUERY = (run) => `wse(${run})`; // don't place a `;`

// Types
export const MOD_TYPE_ADD_FIELD_QUERY = (type, name, definition, init) => `mod_type('${type}', 'add', '${name}', '${definition}'${init ? `, ${init}` : ''});`;
export const MOD_TYPE_ADD_METHOD_QUERY = (type, name, closure) => `mod_type('${type}', 'add', '${name}', ${closure});`;
export const MOD_TYPE_DEL_QUERY = (type, name) => `mod_type('${type}', 'del', '${name}');`;
export const MOD_TYPE_MOD_FIELD_QUERY = (type, name, definition, callback) => `mod_type('${type}', 'mod', '${name}', '${definition}'${callback ? `, ${callback}` : ''});`;
export const MOD_TYPE_MOD_QUERY= (type, name, closure, callback) => `mod_type('${type}', 'mod', '${name}', ${closure}${callback ? `, ${callback}` : ''});`;
export const MOD_TYPE_REL_ADD_QUERY = (type, name, to) => `mod_type('${type}', 'rel', '${name}', '${to}');`;
export const MOD_TYPE_REL_DEL_QUERY = (type, name) => `mod_type('${type}', 'rel', '${name}', nil);`;
export const MOD_TYPE_REN_QUERY = (type, name, to) => `mod_type('${type}', 'ren', '${name}', '${to}');`;
export const MOD_TYPE_WPO_QUERY = (type, mode) => `mod_type('${type}', 'wpo', ${mode});`;
export const SET_TYPE_EMPTY_QUERY = 'set_type("...", {...});';
export const SET_TYPE_QUERY = (type, value) => `set_type("${type}", ${value});`;

// enums
export const MOD_ENUM_ADD_QUERY = (enum_, name, value) => `mod_enum('${enum_}', 'add', '${name}', ${value});`;
export const MOD_ENUM_DEF_QUERY = (enum_, name) => `mod_enum('${enum_}', 'def', '${name}');`;
export const MOD_ENUM_DEL_QUERY = (enum_, name) => `mod_enum('${enum_}', 'del', '${name}');`;
export const MOD_ENUM_MOD_QUERY = (enum_, name, value) => `mod_enum('${enum_}', 'mod', '${name}', ${value});`;
export const MOD_ENUM_REN_QUERY = (enum_, name, to) => `mod_enum('${enum_}', 'ren', '${name}', '${to}');`;
export const SET_ENUM_EMPTY_QUERY = 'set_enum("...", {...});';
export const SET_ENUM_QUERY = (enum_, members) => `set_enum("${enum_}", ${members});`;

// things
export const THING_LIST_DEL_QUERY = (id, name, index) => `thing(${id}).${name}.splice(${index}, 1);`;
export const THING_LIST_EDIT_QUERY = (id, name, index, value) => `thing(${id}).${name}[${index}] = ${value};`;
export const THING_LIST_PUSH_QUERY = (id, name, value) => `thing(${id}).${name}.push(${value});`;
export const THING_PROP_DEL_QUERY = (id, name) => `thing(${id}).del('${name}');`;
export const THING_PROP_EDIT_QUERY = (id, name, value) => `thing(${id}).${name} = ${value};`;
export const THING_PROP_QUERY = (id, name) => `thing(${id}).${name};`;
export const THING_QUERY = (id) => `thing(${id});`;
export const THING_SET_ADD_QUERY = (id, name, value) => `thing(${id}).${name}.add(${value});`;
export const THING_SET_REMOVE_QUERY = (pid, name, cid) => `thing(${pid}).${name}.remove(thing(${cid}));`;

// check types
export const TYPE_INFO_CHILD_THING_QUERY = (cid, pid, name) => `[type(thing(${cid})), type(thing(${pid}).${name}), types_info()];`;
export const TYPE_INFO_ELSE_QUERY = (pid, pname, cname) => `[type(thing(${pid}).${cname}), type(thing(${pid}).${pname}), types_info()];`;
export const TYPE_INFO_PARENT_THING_QUERY = (id, name) => `[type(thing(${id}).${name}), type(thing(${id})), types_info()];`;
export const TYPE_INFO_ROOT_THING_QUERY = (id) => `[type(thing(${id})), '', types_info()];`; // child type, parent type, custom types

// procedures
export const EDIT_PROCEDURE_QUERY = (name, closure) => `del_procedure('${name}'); new_procedure('${name}', ${closure});`;
export const NEW_PROCEDURE_EMPTY_QUERY = 'new_procedure("", );';
export const NEW_PROCEDURE_QUERY = (name, closure) => `new_procedure('${name}', ${closure});`;

// tasks
export const NEW_TASK_EMPTY_QUERY = (args) => `task(${args});`;
export const NEW_TASK_QUERY = (start, closure, args) => `task(datetime(${start}), ${closure}${args.length ? `, [${args}]`: ''});`;
export const TASK_EMPTY_QUERY = 'task();';
export const TASK_QUERY = (id) => `task(${id});`;
export const TASK_SET_ARGS_QUERY = (id, args) => `task(${id}).set_args([${args}]);`;
export const TASK_SET_CLOSURE_QUERY = (id, closure) => ` task(${id}).set_closure(${closure});`;
export const TASK_SET_OWNER_QUERY = (id, owner) => ` task(${id}).set_owner('${owner}');`;

// error
export const ERROR_OUPUT_QUERY = (id, name) => `err = thing(${id}).${name}; [err.code(), err.msg()];`;
export const ERROR_QUERY = (code, msg) => `err(${code}${msg ? `, '${msg}'` : ''})`;
