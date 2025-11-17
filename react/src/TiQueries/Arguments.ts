// general
export const RENAME_ARGS = (current: string, newName: string) => ({ current, newName });
export const NAME_ARGS = (name: string) => ({ name });
export const ID_ARGS = (id: number) => ({ id });

// Types
export const MOD_TYPE_ADD_FIELD_ARGS = (type: string, name: string, definition: string, init: string) => ({ type, name, definition, init });
export const MOD_TYPE_ADD_METHOD_ARGS = (type: string, name: string, closure: string) => ({ type, name, closure });
export const MOD_TYPE_DEL_ARGS = (type: string, name: string) => ({ type, name });
export const MOD_TYPE_MOD_FIELD_ARGS = (type: string, name: string, definition: string, callback: string) => ({ type, name, definition, callback });
export const MOD_TYPE_MOD_ARGS= (type: string, name: string, closure: string, callback: string) => ({ type, name, closure, callback });
export const MOD_TYPE_REL_ADD_REN_ARGS = (type: string, name: string, to: string) => ({ type, name, to });
export const MOD_TYPE_REL_DEL_ARGS = (type: string, name: string) => ({ type, name });
export const MOD_TYPE_WPO_ARGS = (type: string, mode: boolean) => ({ type, mode });
export const SET_TYPE_ARGS = (type: string, values: object) => ({ type, ...values });

// enums
export const MOD_ENUM_ADD_MOD_ARGS = (enum_: string, name: string, value: string) => ({ enum_, name, value });
export const MOD_ENUM_ADD_MOD_BLOB = (value: string) => ({ value });
export const MOD_ENUM_ARGS = (enum_: string, name: string) => ({ enum_, name });
export const MOD_ENUM_REN_ARGS = (enum_: string, name: string, to: string) => ({ enum_, name, to });
export const SET_ENUM_ARGS = (enum_: string, members: object) => ({ enum_, members });
export const SET_ENUM_BLOB = (members: object) => ({ members });

// things
export const THING_LIST_DEL_ARGS = (id: number, name: string, index: number) => ({ id, name, index });
export const THING_PROP_DEL_ARGS = (id: number, name: string) => ({ id, name });
export const THING_SET_REMOVE_ARGS = (pid: number, name: string, cid: number) => ({ pid, name, cid });

// check types
export const TYPE_INFO_CHILD_THING_ARGS = (cid: number, pid: number, name: string) => ({ cid, pid, name });
export const TYPE_INFO_CHILD_ARRAY_ARGS = (pid: number, pname: string, cindex: number) => ({ pid, pname, cindex });
export const TYPE_INFO_PARENT_ARRAY_ARGS = (pid: number, pindex: number, pname: string, cindex: number) => ({ pid, pindex, pname, cindex });
export const TYPE_INFO_PARENT_THING_ARGS = (id: number, name: string) => ({ id, name });

// procedures
export const NEW_EDIT_PROCEDURE_ARGS = (name: string, closure: string) => ({ name, closure });

// tasks
export const NEW_TASK_ARGS = (start: number, closure: string, args: string[]) => ({ start, closure, args });
export const TASK_SET_ARGS_ARGS = (id: number, args: string) => ({ id, args });
export const TASK_SET_CLOSURE_ARGS = (id: number, closure: string) => ({ id, closure });
export const TASK_SET_OWNER_ARGS = (id: number, owner: number) => ({ id, owner });

// error
export const ERROR_OUTPUT_ARGS = (id: number, name: string) => ({ id, name });

// nodes
export const DEL_BACKUP_ARGS = (id: number, deleteFiles: boolean) => ({ id, deleteFiles });
export const NEW_BACKUP_ARGS = (file: string, time: string, repeat: string, maxFiles: number) => ({ file, time, repeat, maxFiles });
export const NEW_MODULE_ARGS = (name: string, source: string, configuration: string) => ({ name, source, configuration });
export const NEW_NODE_ARGS = (secret: string, name: string, port: number) => ({ secret, name, port });
export const RESTORE_ARGS = (fileName: string, takeAccess: boolean, restoreTasks: boolean) => ({ fileName, takeAccess, restoreTasks });
export const SET_LOG_LEVEL_ARGS = (level: number) => ({ level });
export const SET_MODULE_CONF_ARGS = (name: string, configuration: string) => ({ name, configuration });
export const SET_MODULE_SCOPE_ARGS = (name: string, scope: string) => ({ name, scope });

// users
export const DEL_TOKEN_ARGS = (key: string) => ({ key });
export const GRANT_REVOKE_ARGS = (collection: string, name: string, access: number) => ({ collection, name, access });
export const NEW_TOKEN_ARGS = (name: string, expirationTime: number, description: string) => ({ name, expirationTime, description });
export const SET_PASSWORD_ARGS = (name: string, password: string) => ({ name, password });
