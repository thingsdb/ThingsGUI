// general
export const RENAME_ARGS = (current, newName) => ({ current, newName });
export const NAME_ARGS = (name) => ({ name });
export const ID_ARGS = (id) => ({ id });

// Types
export const MOD_TYPE_ADD_FIELD_ARGS = (type, name, definition, init) => ({ type, name, definition, init });
export const MOD_TYPE_ADD_METHOD_ARGS = (type, name, closure) => ({ type, name, closure });
export const MOD_TYPE_DEL_ARGS = (type, name) => ({ type, name });
export const MOD_TYPE_MOD_FIELD_ARGS = (type, name, definition, callback) => ({ type, name, definition, callback });
export const MOD_TYPE_MOD_ARGS= (type, name, closure, callback) => ({ type, name, closure, callback });
export const MOD_TYPE_REL_ADD_REN_ARGS = (type, name, to) => ({ type, name, to });
export const MOD_TYPE_REL_DEL_ARGS = (type, name) => ({ type, name });
export const MOD_TYPE_WPO_ARGS = (type, mode) => ({ type, mode });
export const SET_TYPE_ARGS = (type, values) => ({ type, ...values });

// enums
export const MOD_ENUM_ADD_MOD_ARGS = (enum_, name, value) => ({ enum_, name, value });
export const MOD_ENUM_ADD_MOD_BLOB = (value) => ({ value });
export const MOD_ENUM_ARGS = (enum_, name) => ({ enum_, name });
export const MOD_ENUM_REN_ARGS = (enum_, name, to) => ({ enum_, name, to });
export const SET_ENUM_ARGS = (enum_, members) => ({ enum_, members });
export const SET_ENUM_BLOB = (members) => ({ members });

// things
export const THING_LIST_DEL_ARGS = (id, name, index) => ({ id, name, index });
export const THING_PROP_DEL_ARGS = (id, name) => ({ id, name });
export const THING_SET_REMOVE_ARGS = (pid, name, cid) => ({ pid, name, cid });

// check types
export const TYPE_INFO_CHILD_THING_ARGS = (cid, pid, name) => ({ cid, pid, name });
export const TYPE_INFO_ELSE_ARGS = (pid, cindex, pname) => ({ pid, cindex, pname });
export const TYPE_INFO_PARENT_THING_ARGS = (id, name) => ({ id, name });

// procedures
export const NEW_EDIT_PROCEDURE_ARGS = (name, closure) => ({ name, closure });

// tasks
export const NEW_TASK_ARGS = (start, closure, args) => ({ start, closure, args });
export const TASK_SET_ARGS_ARGS = (id, args) => ({ id, args });
export const TASK_SET_CLOSURE_ARGS = (id, closure) => ({ id, closure });
export const TASK_SET_OWNER_ARGS = (id, owner) => ({ id, owner });

// error
export const ERROR_OUTPUT_ARGS = (id, name) => ({ id, name });

// nodes
export const DEL_BACKUP_ARGS = (id, deleteFiles) => ({ id, deleteFiles });
export const NEW_BACKUP_ARGS = (file, time, repeat, maxFiles) => ({ file, time, repeat, maxFiles });
export const NEW_MODULE_ARGS = (name, source, configuration) => ({ name, source, configuration });
export const NEW_NODE_ARGS = (secret, name, port) => ({ secret, name, port });
export const RESTORE_ARGS = (fileName, takeAccess, restoreTasks) => ({ fileName, takeAccess, restoreTasks });
export const SET_LOG_LEVEL_ARGS = (level) => ({ level });
export const SET_MODULE_CONF_ARGS = (name, configuration) => ({ name, configuration });
export const SET_MODULE_SCOPE_ARGS = (name, scope) => ({ name, scope });

// users
export const DEL_TOKEN_ARGS = (key) => ({ key });
export const GRANT_REVOKE_ARGS = (collection, name, access) => ({ collection, name, access });
export const NEW_TOKEN_ARGS = (name, expirationTime, description) => ({ name, expirationTime, description });
export const SET_PASSWORD_ARGS = (name, password) => ({ name, password });
