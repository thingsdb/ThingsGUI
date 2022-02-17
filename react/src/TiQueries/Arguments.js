// general
export const RENAME_ARGS = (current, newName) => `{"current": "${current}", "newName": "${newName}"}`;
export const NAME_ARGS = (name) => `{"name": "${name}"}`;
export const ID_ARGS = (id) => `{"id": ${id}}`;

// check types
export const TYPE_INFO_CHILD_THING_ARGS = (cid, pid, name) =>  `{"cid": ${cid}, "pid": ${pid}, "name": "${name}"}`;
export const TYPE_INFO_ELSE_ARGS = (pid, cname, pname) =>  `{"pid": ${pid}, "pname": "${pname}", "cname": "${cname}"}`;
export const TYPE_INFO_PARENT_THING_ARGS = (id, name) =>  `{"id": ${id}, "name": "${name}"}`;

// procedures
export const NEW_EDIT_PROCEDURE_ARGS = (name, closure) => `{"name": "${name}", "closure": "${closure}"}`;

// tasks
export const NEW_TASK_ARGS = (start, closure, args) => `{"start": ${start}, "closure": "${closure}", "args": [${args}]}`; // TODO check []
export const TASK_SET_ARGS_ARGS = (id, args) => `{"id": ${id}, "args": [${args}]}`;
export const TASK_SET_CLOSURE_ARGS = (id, closure) => `{"id": ${id}, "closure": "${closure}",}`;
export const TASK_SET_OWNER_ARGS = (id, owner) => `{"id": ${id}, "owner": "${owner}",}`;

// error
export const ERROR_OUPUT_ARGS = (id, name) => `{"id": ${id}, "name": "${name}"}`;

// nodes
export const DEL_BACKUP_ARGS = (id, deleteFiles) => `{"id": ${id}, "deleteFiles": ${deleteFiles}}`;
export const NEW_BACKUP_ARGS = (file, time, repeat, maxFiles) => `{"file": "${file}"${time ? `, "time": ${time}` : ''}${repeat ? `, "repeat": ${repeat}${maxFiles ? `, "maxFiles": ${maxFiles}` : ''}` : ''}}`;
export const NEW_MODULE_ARGS = (name, file, configuration) => configuration ? `{"name": "${name}", "file": "${file}"}` : `{"name": "${name}", "file": "${file}", "configuration": ` + configuration + '}';
export const NEW_NODE_ARGS = (secret, name, port) => `{"secret": "${secret}", "name": "${name}"${port ? `, "port": ${port}` : ''}}`;
export const RESTORE_ARGS = (fileName, takeAccess) => `{"fileName": "${fileName}", "takeAccess": ${takeAccess}}`;
export const SET_LOG_LEVEL_ARGS = (level) => `{"level": ${level}}`;
export const SET_MODULE_CONF_ARGS = (name, configuration) => `{"name": "${name}", "configuration": ` + configuration + '}';
export const SET_MODULE_SCOPE_ARGS = (name, scope) => `{"name": "${name}" , "scope": ${scope ? `"${scope}"` : null}}`;

// users
export const DEL_TOKEN_ARGS = (key) => `{"key", "${key}"}`;
export const GRANT_REVOKE_ARGS = (collection, name, access) => `{"collection": "${collection}", "name": "${name}", "access": ${access}}`;
export const NEW_TOKEN_ARGS = (name, expirationTime, description) => `{"name": "${name}", "expirationTime": ${expirationTime || null}, "description": "${description || ''}"}`;
export const SET_PASSWORD_ARGS = (name, password) => `{"name": "${name}", "password": ${password && `"${password}"`}}`;
