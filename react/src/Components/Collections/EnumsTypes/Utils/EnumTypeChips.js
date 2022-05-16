import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@mui/icons-material/DirectionsRun';
import ViewIcon from '@mui/icons-material/Visibility';

import { AddDialog, AddLink, EditDialog, Relation, ViewDialog } from '.';
import { ChipsCard, DownloadBlob } from '../../../Utils';
import { THINGS_DOC_DATATYPES } from '../../../../Constants/Links';
import { THINGDB_CACHE } from '../../../../Constants/Files';
import {
    MOD_ENUM_ADD_MOD_ARGS,
    MOD_ENUM_ADD_MOD_BLOB,
    MOD_ENUM_ARGS,
    MOD_ENUM_REN_ARGS,
    MOD_TYPE_ADD_FIELD_ARGS,
    MOD_TYPE_ADD_METHOD_ARGS,
    MOD_TYPE_DEL_ARGS,
    MOD_TYPE_MOD_ARGS,
    MOD_TYPE_MOD_FIELD_ARGS,
    MOD_TYPE_REL_ADD_REN_ARGS,
    MOD_TYPE_REL_DEL_ARGS,
    MOD_TYPE_WPO_ARGS,
    SET_ENUM_ARGS,
    SET_ENUM_BLOB,
    SET_TYPE_ARGS,
} from '../../../../TiQueries/Arguments';
import {
    MOD_ENUM_ADD_QUERY,
    MOD_ENUM_DEF_QUERY,
    MOD_ENUM_DEL_QUERY,
    MOD_ENUM_MOD_QUERY,
    MOD_ENUM_REN_QUERY,
    MOD_TYPE_ADD_FIELD_QUERY,
    MOD_TYPE_ADD_METHOD_QUERY,
    MOD_TYPE_DEL_QUERY,
    MOD_TYPE_MOD_FIELD_QUERY,
    MOD_TYPE_MOD_QUERY,
    MOD_TYPE_REL_ADD_QUERY,
    MOD_TYPE_REL_DEL_QUERY,
    MOD_TYPE_REN_QUERY,
    MOD_TYPE_WPO_QUERY,
    SET_ENUM_QUERY,
    SET_TYPE_QUERY,

    MOD_ENUM_ADD_FORMAT_QUERY,
    MOD_ENUM_DEF_FORMAT_QUERY,
    MOD_ENUM_DEL_FORMAT_QUERY,
    MOD_ENUM_MOD_FORMAT_QUERY,
    MOD_ENUM_REN_FORMAT_QUERY,
    MOD_TYPE_ADD_FIELD_FORMAT_QUERY,
    MOD_TYPE_ADD_METHOD_FORMAT_QUERY,
    MOD_TYPE_DEL_FORMAT_QUERY,
    MOD_TYPE_MOD_FIELD_FORMAT_QUERY,
    MOD_TYPE_MOD_FORMAT_QUERY,
    MOD_TYPE_REL_ADD_FORMAT_QUERY,
    MOD_TYPE_REL_DEL_FORMAT_QUERY,
    MOD_TYPE_REN_FORMAT_QUERY,
    MOD_TYPE_WPO_FORMAT_QUERY,
    SET_ENUM_FORMAT_QUERY,
    SET_TYPE_FORMAT_QUERY,
} from '../../../../TiQueries/Queries';


const headers = {
    type: {
        fields: [
            {ky: 'propertyName', label: 'Name'},
            {ky: 'propertyObject', label: 'Type'},
            {ky: 'propertyRelation', label: 'Relation'}
        ],
        methods: [
            {ky: 'propertyName', label: 'Name'},
            {ky: 'definition', label: 'Definition'},
        ]
    },
    enum: {
        members: [
            {ky: 'default', label: 'Default'},
            {ky: 'propertyName', label: 'Name'},
            {ky: 'propertyObject', label: 'Value'},
        ]
    }
};

const queries = {
    add: {
        type: (name, list) => {
            const obj = list.reduce((res, v) => {
                // the set_type_ prefix is there to guarantee that the key in the argument object is unique.
                const uniqueKey = `set_type_${v.propertyName}`;

                res.value.push(`${v.propertyName}: ${v.propertyType ? `'${v.propertyType}'` : `'${v.definition}'`}`);
                res.valueJson = {...res.valueJson, [uniqueKey]: v.propertyType ? v.propertyType : v.definition};
                res.valueQuery.push(`${v.propertyName}: ${v.propertyType ? uniqueKey : `closure(${uniqueKey})`}`);

                return res;
            }, {value: [], valueJson: {}, valueQuery: []});

            const value = `{${obj.value}}`;
            const valueJson = obj.valueJson;
            const valueQuery = `{${obj.valueQuery}}`;

            return ({
                jsonArgs: SET_TYPE_ARGS(name, valueJson),
                query: SET_TYPE_QUERY(valueQuery),
                queryString: SET_TYPE_FORMAT_QUERY(name, value)
            });
        },
        enum: (name, list) => {
            let hasBlob = false;
            const obj = list.reduce((res, v) => {
                let blob = v.propertyBlob;
                let name = v.propertyName;
                let val = v.propertyVal;
                res.value.push(`${name}: ${val}`);

                if (blob && Object.keys(blob).length > 0) {
                    hasBlob = true;
                    res.valueBlob = {...res.valueBlob, [name]: blob[val]};
                } else {
                    res.valueJson = {...res.valueJson, [name]: val};
                }

                return res;
            }, {value: [], valueBlob: {}, valueJson: {}, valueQuery: []});

            const value = `{${obj.value}}`;
            const valueJson = obj.valueJson;
            const valueBlob = obj.valueBlob;

            return ({
                jsonArgs: SET_ENUM_ARGS(name, valueJson),
                query: SET_ENUM_QUERY,
                queryString: SET_ENUM_FORMAT_QUERY(name, value),
                blob: hasBlob ? SET_ENUM_BLOB(valueBlob) : null
            });
        }
    },
    mod: {
        addField: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_ADD_FIELD_ARGS(name, update.propertyName, update.propertyType, update.propertyVal),
                query: MOD_TYPE_ADD_FIELD_QUERY(update.propertyVal),
                queryString: MOD_TYPE_ADD_FIELD_FORMAT_QUERY(name, update.propertyName, update.propertyType, update.propertyVal),
            }),
            enum: (name, update) => {
                let blob = update.propertyBlob;
                let hasBlob = blob && Object.keys(blob).length > 0;
                return ({
                    jsonArgs: MOD_ENUM_ADD_MOD_ARGS(name, update.propertyName, update.propertyVal),
                    query: MOD_ENUM_ADD_QUERY,
                    queryString: MOD_ENUM_ADD_FORMAT_QUERY(name, update.propertyName, update.propertyVal),
                    blob: hasBlob ? MOD_ENUM_ADD_MOD_BLOB(blob[update.propertyVal]) : null
                });
            }
        },
        addMethod: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_ADD_METHOD_ARGS(name, update.propertyName, update.definition),
                query: MOD_TYPE_ADD_METHOD_QUERY,
                queryString: MOD_TYPE_ADD_METHOD_FORMAT_QUERY(name, update.propertyName, update.definition),
            }),
        },
        mod: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_MOD_FIELD_ARGS(name, update.propertyName, update.propertyType, update.callback),
                query: MOD_TYPE_MOD_FIELD_QUERY(update.callback),
                queryString: MOD_TYPE_MOD_FIELD_FORMAT_QUERY(name, update.propertyName, update.propertyType, update.callback),
            }),
            enum: (name, update) => {
                let blob = update.propertyBlob;
                let hasBlob = blob && Object.keys(blob).length > 0;
                return ({
                    jsonArgs: MOD_ENUM_ADD_MOD_ARGS(name, update.propertyName, update.propertyVal),
                    query: MOD_ENUM_MOD_QUERY,
                    queryString: MOD_ENUM_MOD_FORMAT_QUERY(name, update.propertyName, update.propertyVal),
                    blob: hasBlob ? MOD_ENUM_ADD_MOD_BLOB(blob[update.propertyVal]) : null
                });
            }
        },
        ren: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_REL_ADD_REN_ARGS(name, update.oldname, update.newname),
                query: MOD_TYPE_REN_QUERY,
                queryString: MOD_TYPE_REN_FORMAT_QUERY(name, update.oldname, update.newname),
            }),
            enum: (name, update) => ({
                jsonArgs: MOD_ENUM_REN_ARGS(name, update.oldname, update.newname),
                query: MOD_ENUM_REN_QUERY,
                queryString: MOD_ENUM_REN_FORMAT_QUERY(name, update.oldname, update.newname)
            }),
        },
        rel: {
            type: (name, update) => ({
                jsonArgs:  MOD_TYPE_REL_ADD_REN_ARGS(name, update.relation.property, update.relation.propertyToo),
                query: MOD_TYPE_REL_ADD_QUERY,
                queryString: MOD_TYPE_REL_ADD_FORMAT_QUERY(name, update.relation.property, update.relation.propertyToo),
            }),
        },
        delRel: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_REL_DEL_ARGS(name, update.propertyName),
                query: MOD_TYPE_REL_DEL_QUERY,
                queryString: MOD_TYPE_REL_DEL_FORMAT_QUERY(name, update.propertyName)
            }),
        },
        def: {
            enum: (name, update) => ({
                jsonArgs: MOD_ENUM_ARGS(name, update.propertyName),
                query: MOD_ENUM_DEF_QUERY,
                queryString: MOD_ENUM_DEF_FORMAT_QUERY(name, update.propertyName)
            }),
        },
        del: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_DEL_ARGS(name, update.propertyName),
                query: MOD_TYPE_DEL_QUERY,
                queryString: MOD_TYPE_DEL_FORMAT_QUERY(name, update.propertyName),
            }),
            enum: (name, update) => ({
                jsonArgs: MOD_ENUM_ARGS(name, update.propertyName),
                query: MOD_ENUM_DEL_QUERY,
                queryString: MOD_ENUM_DEL_FORMAT_QUERY(name, update.propertyName),
            }),
        },
        wpo: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_WPO_ARGS(name, update.wpo),
                query: MOD_TYPE_WPO_QUERY,
                queryString: MOD_TYPE_WPO_FORMAT_QUERY(name, update.wpo),
            }),
        },
        met: {
            type: (name, update) => ({
                jsonArgs: MOD_TYPE_MOD_ARGS(name, update.propertyName, update.definition, update.callback),
                query: MOD_TYPE_MOD_QUERY(update.callback),
                queryString: MOD_TYPE_MOD_FORMAT_QUERY(name, update.propertyName, update.definition, update.callback)
            }),
        }
    }
};

const fmrows = (callback, fields, isType, item, scope, view ) => item[fields] ? item[fields].map(([n,v])=> {
    const isBlob = v.constructor === String && v.includes(THINGDB_CACHE);
    let obj;
    if(isBlob) {
        obj = <DownloadBlob val={v} />;
    } else {
        const str = v.constructor === Object ? JSON.stringify(v) : v;
        obj = !isType ? str : <AddLink name={str} scope={scope} onChange={view.view ? callback('view') : callback('edit')} />;
    }

    const relation = item.relations && item.relations[n];

    return({
        default: item.default === n ? <CheckIcon /> : null,
        propertyName: n,
        propertyType: isType ? v : '',
        propertyVal: isType ? '' : v,
        propertyObject: obj,
        propertyRelation: <Relation onChange={callback} relation={relation} scope={scope} view={view.view ? 'view' : 'edit'} />,
        wpo: item.wpo
    });
}):[];

const tableInfo = {
    type: (callback, items, scope, view) => {
        const item = view.name && items && items.find(i => i.name == view.name) || {};
        const rows = {
            fields: fmrows(callback, 'fields', true, item, scope, view),
            methods: Object.entries(item.methods||{}).reduce((res, k) => {res.push({propertyName: k[0], definition: k[1].definition}); return res;},[]),
        };
        return [item, rows];
    },
    enum: (callback, items, scope, view) => {
        const item = view.name && items && items.find(i => i.name == view.name) || {};
        const rows = {
            members: fmrows(callback, 'members', false, item, scope, view),
        };
        return [item, rows];
    },
};

const EnumTypeChips = ({buttonsView, categoryInit, datatypes, items, onChange, onClose, onDelete, onInfo, onMakeInstanceInit, onRename, onSetQueryInput, scope, tag, view}) => {
    React.useEffect(() => {
        onInfo(scope, tag);
    }, [onInfo, scope, tag]);

    const handleCallback = (s, t) => onInfo(s, t);

    const handleClickDelete = (n, cb, tag) => {
        onDelete(
            scope,
            n,
            tag,
            () => {
                cb();
            }
        );
    };

    const handleClickRun = (n) => ({target}) => {
        const circularRefFlag = {};
        const names = [...items.map(c=>c.name)];
        const i = onMakeInstanceInit(n, names, items, circularRefFlag, target);
        onSetQueryInput(i);
    };

    const handleClickAdd = () => {
        onChange('add')('', categoryInit);
    };
    const handleCloseAdd= () => {
        onClose('add', categoryInit);
    };

    const handleCloseView = () => {
        onClose('view', categoryInit);
    };


    const handleCloseEdit = () => {
        onClose('edit', categoryInit);
    };

    const handleChangeViaButton = (a, n) => () => {
        onChange(a)(n, categoryInit);
    };

    const buttons = (bv) => (n) => {
        let b = [];
        if (bv.view) {
            b.push({
                icon: <ViewIcon fontSize="small" />,
                onClick: handleChangeViaButton('view', n),
            });
        }
        if (bv.run) {
            b.push({
                icon: <RunIcon fontSize="small" />,
                onClick: handleClickRun(n),
            });
        }
        if (bv.edit) {
            b.push({
                icon: <EditIcon fontSize="small" />,
                onClick: handleChangeViaButton('edit', n),
            });
        }

        return b;
    };

    const [item, rows] = React.useMemo(() => tableInfo[categoryInit](onChange, items, scope, view), [categoryInit, onChange, items, scope, view]);

    return (
        <Grid item xs={12} sx={{paddingBottom: '8px'}}>
            <ChipsCard
                buttons={buttons(buttonsView)}
                items={items}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                warnExpression={i=>i.wrap_only}
                tag={tag}
                title={`${categoryInit}s`}
            />
            {buttonsView.add && (
                <AddDialog
                    dataTypes={datatypes}
                    category={categoryInit}
                    getInfo={handleCallback}
                    link={`${THINGS_DOC_DATATYPES}${categoryInit}/`}
                    onClose={handleCloseAdd}
                    open={view.add}
                    scope={scope}
                    queries={queries.add}
                />
            )}
            {buttonsView.edit && (
                <EditDialog
                    dataTypes={datatypes}
                    category={categoryInit}
                    getInfo={handleCallback}
                    headers={headers[categoryInit]}
                    item={item}
                    link={`${THINGS_DOC_DATATYPES}${categoryInit}/`}
                    onChangeItem={onChange('edit')}
                    onClose={handleCloseEdit}
                    open={view.edit}
                    onRename={onRename}
                    rows={rows}
                    scope={scope}
                    queries={queries.mod}
                />
            )}
            {buttonsView.view && (
                <ViewDialog
                    category={categoryInit}
                    headers={headers[categoryInit]}
                    item={item}
                    link={`${THINGS_DOC_DATATYPES}${categoryInit}/`}
                    onChangeItem={onChange('view')}
                    onClose={handleCloseView}
                    open={view.view}
                    rows={rows}
                    scope={scope}
                />
            )}
        </Grid>
    );
};

EnumTypeChips.defaultProps = {
    datatypes: [],
    onChange: ()=>null,
    onClose: ()=>null,
    onDelete: ()=>null,
    onInfo: ()=>null,
    onMakeInstanceInit: ()=>null,
    onRename: ()=>null,
    onSetQueryInput: ()=>null,
    items: [],
};

EnumTypeChips.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    categoryInit: PropTypes.string.isRequired,
    datatypes: PropTypes.arrayOf(PropTypes.string),
    items: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onInfo: PropTypes.func,
    onMakeInstanceInit: PropTypes.func,
    onRename: PropTypes.func,
    onSetQueryInput: PropTypes.func,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    view: PropTypes.object.isRequired,
};

export default EnumTypeChips;