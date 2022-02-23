// general
export const RENAME_ARGS = (current, newName) => JSON.stringify({ current, newName });
export const NAME_ARGS = (name) => JSON.stringify({ name });
export const ID_ARGS = (id) => JSON.stringify({ id });

// Types
export const MOD_TYPE_ADD_FIELD_ARGS = (type, name, definition, init) => JSON.stringify({ type, name, definition, init });
export const MOD_TYPE_ADD_METHOD_ARGS = (type, name, closure) => JSON.stringify({ type, name, closure });
export const MOD_TYPE_DEL_ARGS = (type, name) => JSON.stringify({ type, name });
export const MOD_TYPE_MOD_FIELD_ARGS = (type, name, definition, callback) => JSON.stringify({ type, name, definition, callback });
export const MOD_TYPE_MOD_ARGS= (type, name, closure, callback) => JSON.stringify({ type, name, closure, callback });
export const MOD_TYPE_REL_ADD_REN_ARGS = (type, name, to) => JSON.stringify({ type, name, to });
export const MOD_TYPE_REL_DEL_ARGS = (type, name) => JSON.stringify({ type, name });
export const MOD_TYPE_WPO_ARGS = (type, mode) => JSON.stringify({ type, mode });
export const SET_TYPE_ARGS = (type, values) => JSON.stringify({ type, ...values });

// enums
export const MOD_ENUM_ADD_MOD_ARGS = (enum_, name, value) => JSON.stringify({ enum_, name, value });
export const MOD_ENUM_ARGS = (enum_, name) => JSON.stringify({ enum_, name });
export const MOD_ENUM_REN_ARGS = (enum_, name, to) => JSON.stringify({ enum_, name, to });
export const SET_ENUM_ARGS = (enum_, members) => JSON.stringify({ enum_, members });

// things
export const THING_LIST_DEL_ARGS = (id, name, index) => JSON.stringify({ id, name, index });
export const THING_PROP_DEL_ARGS = (id, name) => JSON.stringify({ id, name });
export const THING_SET_REMOVE_ARGS = (pid, name, cid) => JSON.stringify({ pid, name, cid });

// check types
export const TYPE_INFO_CHILD_THING_ARGS = (cid, pid, name) => JSON.stringify({ cid, pid, name });
export const TYPE_INFO_ELSE_ARGS = (pid, cname, pname) => JSON.stringify({ pid, cname, pname });
export const TYPE_INFO_PARENT_THING_ARGS = (id, name) => JSON.stringify({ id, name });

// procedures
export const NEW_EDIT_PROCEDURE_ARGS = (name, closure) => JSON.stringify({ name, closure });

// tasks
export const NEW_TASK_ARGS = (start, closure, args) => JSON.stringify({ start, closure }).slice(0, -1) + `, "args": [${args}]}`;
export const TASK_SET_ARGS_ARGS = (id, args) => JSON.stringify({ id }).slice(0, -1) + `, "args": [${args}]}`;
export const TASK_SET_CLOSURE_ARGS = (id, closure) => JSON.stringify({ id, closure });
export const TASK_SET_OWNER_ARGS = (id, owner) => JSON.stringify({ id, owner });

// error
export const ERROR_OUTPUT_ARGS = (id, name) => JSON.stringify({ id, name });

// nodes
export const DEL_BACKUP_ARGS = (id, deleteFiles) => JSON.stringify({ id, deleteFiles });
export const NEW_BACKUP_ARGS = (file, time, repeat, maxFiles) => JSON.stringify({ file, time, repeat, maxFiles });
export const NEW_MODULE_ARGS = (name, source, configuration) => JSON.stringify({ name, source, configuration });
export const NEW_NODE_ARGS = (secret, name, port) => JSON.stringify({ secret, name, port });
export const RESTORE_ARGS = (fileName, takeAccess) => JSON.stringify({ fileName, takeAccess });
export const SET_LOG_LEVEL_ARGS = (level) => JSON.stringify({ level });
export const SET_MODULE_CONF_ARGS = (name, configuration) => JSON.stringify({ name, configuration });
export const SET_MODULE_SCOPE_ARGS = (name, scope) => JSON.stringify({ name, scope });

// users
export const DEL_TOKEN_ARGS = (key) => JSON.stringify({ key });
export const GRANT_REVOKE_ARGS = (collection, name, access) => JSON.stringify({ collection, name, access });
export const NEW_TOKEN_ARGS = (name, expirationTime, description) => JSON.stringify({ name, expirationTime, description });
export const SET_PASSWORD_ARGS = (name, password) => JSON.stringify({ name, password });




// // general
// export const RENAME_ARGS = (current, newName) => `{"current": "${current}", "newName": "${newName}"}`;
// export const NAME_ARGS = (name) => `{"name": "${name}"}`;
// export const ID_ARGS = (id) => `{"id": ${id}}`;

// // Types
// export const MOD_TYPE_ADD_FIELD_ARGS = (type, name, definition, init) => `{"type": "${type}", "name": "${name}", "definition": "${definition}"${init ? `, "init": ${init}` : ''}}`;
// export const MOD_TYPE_ADD_METHOD_ARGS = (type, name, closure) => `{"type": "${type}", "name": "${name}", "closure": "${closure}"}`;
// export const MOD_TYPE_DEL_ARGS = (type, name) => `{"type": "${type}", "name": "${name}"}`;
// export const MOD_TYPE_MOD_FIELD_ARGS = (type, name, definition, callback) => `{"type": "${type}", "name": "${name}", "definition": "${definition}"${callback ? `, "callback": "${callback}"` : ''}}`;
// export const MOD_TYPE_MOD_ARGS= (type, name, closure, callback) => `{"type": "${type}", "name": "${name}", "closure": "${closure}"${callback ? `, "callback": "${callback}"` : ''}}`;
// export const MOD_TYPE_REL_ADD_REN_ARGS = (type, name, to) => `{"type": "${type}", "name": "${name}", "to": "${to}"}`;
// export const MOD_TYPE_REL_DEL_ARGS = (type, name) => `{"type": "${type}", "name": "${name}"}`;
// export const MOD_TYPE_WPO_ARGS = (type, mode) => `{"type": "${type}", "mode": ${mode}}`;
// export const SET_TYPE_ARGS = (type, values) => `{"type": "${type}", ${values}}`;

// // enums
// export const MOD_ENUM_ADD_MOD_ARGS = (enum_, name, value) => `{"enum": "${enum_}", "name": "${name}", "value": ${value}}`;
// export const MOD_ENUM_ARGS = (enum_, name) => `{"enum": "${enum_}", "name": "${name}"}`;
// export const MOD_ENUM_REN_ARGS = (enum_, name, to) => `{"enum": "${enum_}", "name": "${name}", "to": "${to}"}`;
// export const SET_ENUM_ARGS = (enum_, members) => `{"enum": "${enum_}", "members": ${members}}`;

// // things
// export const THING_LIST_DEL_ARGS = (id, name, index) => `{"id": ${id}, "name": "${name}", "index": ${index}}`;
// export const THING_PROP_DEL_ARGS = (id, name) => `{"id": ${id}, "name": "${name}"}`;
// export const THING_SET_REMOVE_ARGS = (pid, name, cid) => `{"pid": ${pid}, "name": "${name}", "cid": ${cid}}`;

// // check types
// export const TYPE_INFO_CHILD_THING_ARGS = (cid, pid, name) =>  `{"cid": ${cid}, "pid": ${pid}, "name": "${name}"}`;
// export const TYPE_INFO_ELSE_ARGS = (pid, cname, pname) =>  `{"pid": ${pid}, "pname": "${pname}", "cname": "${cname}"}`;
// export const TYPE_INFO_PARENT_THING_ARGS = (id, name) =>  `{"id": ${id}, "name": "${name}"}`;

// // procedures
// export const NEW_EDIT_PROCEDURE_ARGS = (name, closure) => `{"name": "${name}", "closure": "${closure}"}`;

// // tasks
// export const NEW_TASK_ARGS = (start, closure, args) => `{"start": ${start}, "closure": "${closure}", "args": [${args}]}`; // TODO check []
// export const TASK_SET_ARGS_ARGS = (id, args) => `{"id": ${id}, "args": [${args}]}`;
// export const TASK_SET_CLOSURE_ARGS = (id, closure) => `{"id": ${id}, "closure": "${closure}"}`;
// export const TASK_SET_OWNER_ARGS = (id, owner) => `{"id": ${id}, "owner": "${owner}"}`;

// // error
// export const ERROR_OUTPUT_ARGS = (id, name) => `{"id": ${id}, "name": "${name}"}`;

// // nodes
// export const DEL_BACKUP_ARGS = (id, deleteFiles) => `{"id": ${id}, "deleteFiles": ${deleteFiles}}`;
// export const NEW_BACKUP_ARGS = (file, time, repeat, maxFiles) => `{"file": "${file}"${time ? `, "time": ${time}` : ''}${repeat ? `, "repeat": ${repeat}${maxFiles ? `, "maxFiles": ${maxFiles}` : ''}` : ''}}`;
// export const NEW_MODULE_ARGS = (name, source, configuration) => configuration ? `{"name": "${name}", "source": "${source}", "configuration": ${configuration}}` : `{"name": "${name}", "source": "${source}"}`;
// export const NEW_NODE_ARGS = (secret, name, port) => `{"secret": "${secret}", "name": "${name}"${port ? `, "port": ${port}` : ''}}`;
// export const RESTORE_ARGS = (fileName, takeAccess) => `{"fileName": "${fileName}", "takeAccess": ${takeAccess}}`;
// export const SET_LOG_LEVEL_ARGS = (level) => `{"level": ${level}}`;
// export const SET_MODULE_CONF_ARGS = (name, configuration) => `{"name": "${name}", "configuration": ${configuration}}`;
// export const SET_MODULE_SCOPE_ARGS = (name, scope) => `{"name": "${name}" , "scope": ${scope ? `"${scope}"` : null}}`;

// // users
// export const DEL_TOKEN_ARGS = (key) => `{"key", "${key}"}`;
// export const GRANT_REVOKE_ARGS = (collection, name, access) => `{"collection": "${collection}", "name": "${name}", "access": ${access}}`;
// export const NEW_TOKEN_ARGS = (name, expirationTime, description) => `{"name": "${name}", "expirationTime": ${expirationTime || null}, "description": "${description || ''}"}`;
// export const SET_PASSWORD_ARGS = (name, password) => `{"name": "${name}", "password": ${password && `"${password}"`}}`;
