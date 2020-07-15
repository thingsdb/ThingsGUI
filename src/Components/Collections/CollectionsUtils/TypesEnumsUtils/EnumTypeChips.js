/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles} from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ChipsCard, DownloadBlob} from '../../../Util';
import {AddDialog, AddLink, EditDialog, ViewDialog} from '.';


const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));

const headers = {
    type: {
        Fields: [
            {ky: 'propertyName', label: 'Name'},
            {ky: 'propertyObject', label: 'Type'},
        ],
        Methods: [
            {ky: 'propertyName', label: 'Name'},
            {ky: 'definition', label: 'Definition'},
        ]
    },
    enum: {
        Members: [
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
        add: {
            type: (name, update) => ( `mod_type('${name}', 'add', '${update.propertyName}', ` + (
                update.definition ? `${update.definition})`
                    : `'${update.propertyType}'${update.propertyVal?`, ${update.propertyVal}`:''})`
            )),
            enum: (name, update) => `mod_enum('${name}', 'add', '${update.propertyName}', ${update.propertyVal})`
        },
        mod: {
            type: (name, update) => ( update.propertyType ?
                `mod_type('${name}', 'mod', '${update.propertyName}', '${update.propertyType}'` + (update.callback ? `, ${update.callback}` : '') + ')'
                    : `mod_type('${name}', 'mod', '${update.propertyName}', ${update.definition}` + (update.callback ? `, ${update.callback}` : '') + ')'
            ),
            enum: (name, update) => `mod_enum('${name}', 'mod', '${update.propertyName}', ${update.propertyVal})`
        },
        ren: {
            type: (name, oldname, newname) => `mod_type('${name}', 'ren', '${oldname}', '${newname}')`,
            enum: (name, oldname, newname) => `mod_enum('${name}', 'ren', '${oldname}', '${newname}')`
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
    }
};

const EnumTypeChips = ({buttonsView, categoryInit, datatypes, onChange, onClose, onDelete, onInfo, onMakeInstanceInit, onSetQueryInput, scope, tag, view}) => {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        handleRefresh();
    }, [scope]);

    const handleItems = (t) => {
        setItems(t);
    };

    const handleRefresh = () => onInfo(scope, tag, handleItems);
    const handleCallback = (s, t) => onInfo(s, t, handleItems);

    const handleClickDelete = (n, cb, tag) => {
        onDelete(
            scope,
            n,
            tag,
            (p) => {
                cb();
                handleItems(p);
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
        onChange(a)(n, categoryInit)
    };
    const handleChangeViaLink = (a) => (n, c) => {
        onChange(a)(n, c)
    };

    const buttons = (bv) => (n)=>{
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

    const item = view.name&&items&&items.find(i=>i.name==view.name)||{};
    const fields = categoryInit==='type'?'fields':'members';
    const noLink = categoryInit==='enum';
    const obj = item[fields] ? item[fields].map(([n,v])=>{
        const isBlob = v.constructor===String&&v.includes('/download/tmp/thingsdb-cache');
        const objectProof = !isBlob&&v.constructor===Object?JSON.stringify(v):v;
        const obj = isBlob? <DownloadBlob val={v} /> : noLink ? objectProof : <AddLink name={objectProof} scope={scope} onChange={view.view?handleChangeViaLink('view'):handleChangeViaLink('edit')} />;
        return({
            default: item.default===n ? <CheckIcon /> : null,
            propertyName: n,
            propertyType: categoryInit==='type'?v:'',
            propertyVal: categoryInit==='type'?'':v,
            propertyObject: obj,
            wpo: item.wpo
        });
    }):[];

    const rows = {
        Members: item[fields] ? obj : [],
        Fields: item[fields] ? obj : [],
        Methods: Object.entries(item.methods||{}).reduce((res, k) => {res.push({propertyName: k[0], definition: k[1].definition}); return res;},[])
    };

    return (
        <Grid className={classes.spacing} item xs={12}>
            <ChipsCard
                buttons={buttons(buttonsView)}
                expand={false}
                items={items}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                onDelete={handleClickDelete}
                title={`${categoryInit}s`}
                warnExpression={i=>i.wrap_only}
            />
            {buttonsView.add && (
                <AddDialog
                    dataTypes={datatypes}
                    category={categoryInit}
                    getInfo={handleCallback}
                    link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
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
                    link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
                    onChangeItem={onChange('edit')}
                    onClose={handleCloseEdit}
                    open={view.edit}
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
                    link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
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
    onSetQueryInput: ()=>null,
};

EnumTypeChips.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    categoryInit: PropTypes.string.isRequired,
    datatypes: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onInfo: PropTypes.func,
    onMakeInstanceInit: PropTypes.func,
    onSetQueryInput: PropTypes.func,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    view: PropTypes.object.isRequired,
};

export default EnumTypeChips;