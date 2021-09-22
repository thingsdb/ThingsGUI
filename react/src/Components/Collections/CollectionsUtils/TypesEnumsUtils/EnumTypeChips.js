import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@mui/icons-material/DirectionsRun';
import ViewIcon from '@mui/icons-material/Visibility';

import {AddDialog, AddLink, EditDialog, Relation, ViewDialog} from '.';
import {ChipsCard, DownloadBlob} from '../../../Util';
import {THINGS_DOC_DATATYPES} from '../../../../Constants/Links';
import {THINGDB_CACHE} from '../../../../Constants/Files';


const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));

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
        type: (name, list) => `set_type("${name}", {${list.map(v=>`${v.propertyName}: ${v.propertyType?`'${v.propertyType}'`:`${v.definition}`}`)}})` ,
        enum: (name, list) => `set_enum("${name}", {${list.map(v=>`${v.propertyName}: ${v.propertyVal}`)}})`
    },
    mod: {
        addField: {
            type: (name, update) => `mod_type('${name}', 'add', '${update.propertyName}', '${update.propertyType}'${update.propertyVal?`, ${update.propertyVal}`:''})`,
            enum: (name, update) => `mod_enum('${name}', 'add', '${update.propertyName}', ${update.propertyVal})`
        },
        addMethod: {
            type: (name, update) => `mod_type('${name}', 'add', '${update.propertyName}', ${update.definition})`,
        },
        mod: {
            type: (name, update) => ( `mod_type('${name}', 'mod', '${update.propertyName}', '${update.propertyType}'` + (update.callback ? `, ${update.callback}` : '') + ')'),
            enum: (name, update) => `mod_enum('${name}', 'mod', '${update.propertyName}', ${update.propertyVal})`
        },
        ren: {
            type: (name, update) => `mod_type('${name}', 'ren', '${update.oldname}', '${update.newname}')`,
            enum: (name, update) => `mod_enum('${name}', 'ren', '${update.oldname}', '${update.newname}')`
        },
        rel: {
            type: (name, update) => `mod_type('${name}', 'rel', '${update.relation.property}', '${update.relation.propertyToo}')`,
        },
        delRel: {
            type: (name, update) => `mod_type('${name}', 'rel', '${update.propertyName}', nil)`,
        },
        def: {
            enum: (name, update) => `mod_enum('${name}', 'def', '${update.propertyName}')`
        },
        del: {
            type: (name, update) => `mod_type('${name}', 'del', '${update.propertyName}')`,
            enum: (name, update) => `mod_enum('${name}', 'del', '${update.propertyName}')`
        },
        wpo: {
            type: (name, update) => `mod_type('${name}', 'wpo', ${update.wpo})`,
        },
        met: {
            type: (name, update) => (`mod_type('${name}', 'mod', '${update.propertyName}', ${update.definition}` + (update.callback ? `, ${update.callback}` : '') + ')'),
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
    const classes = useStyles();

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
                icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
                onClick: handleChangeViaButton('edit', n),
            });
        }

        return b;
    };

    const [item, rows] = React.useMemo(() => tableInfo[categoryInit](onChange, items, scope, view), [categoryInit, onChange, items, scope, view]);

    return (
        <Grid className={classes.spacing} item xs={12}>
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