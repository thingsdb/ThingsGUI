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

const EnumTypeChips = ({buttonsView, categoryInit, datatypes, fields, noLink, onChange, onClose, onDelete, onInfo, onMakeInstanceInit, onSetQueryInput, scope, tag, view}) => {
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
        onChange('add', categoryInit, '');
    };
    const handleCloseAdd= () => {
        onClose('add', categoryInit);
    };

    const handleClickView = (n) => () => {
        onChange('view', categoryInit, n);
    };

    const handleChangeView = (n, c) => {
        onClose('view');
        onChange('view', c, n);
    };

    const handleCloseView = () => {
        onClose('view', categoryInit);
    };

    const handleClickEdit = (n, c) => () => {
        onChange('edit', c, n);
    };
    const handleChangeEdit = (n, c) => {
        onClose('edit');
        onChange('edit', c, n);
    };
    const handleCloseEdit = () => {
        onClose('edit', categoryInit);
    };

    const buttons = (bv) => (n)=>{
        let b = [];
        if (bv.view) {
            b.push({
                icon: <ViewIcon fontSize="small" />,
                onClick: handleClickView(n),
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
                onClick: handleClickEdit(n, categoryInit),
            });
        }

        return b;
    };

    const item = view.name&&items?items.find(i=>i.name==view.name):{};
    const rows = item[fields] ? item[fields].map(c=>{
        const isBlob = c[1].constructor===String&&c[1].includes('/download/tmp/thingsdb-cache');
        const objectProof = !isBlob&&c[1].constructor===Object?JSON.stringify(c[1]):c[1];
        const obj = isBlob? <DownloadBlob val={c[1]} /> : noLink ? objectProof : <AddLink name={objectProof} scope={scope} onChange={view.view?handleChangeView:handleChangeEdit} />;
        return({
            default: item.default===c[0]? <CheckIcon />: null,
            propertyName: c[0],
            propertyType: categoryInit=='type'?c[1]:'',
            propertyVal: categoryInit=='type'?'':c[1],
            propertyObject: obj,
        });
    }):[];

    return (
        <Grid className={classes.spacing} item xs={12}>
            <ChipsCard
                buttons={buttons(buttonsView)}
                expand={false}
                items={items}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                onDelete={handleClickDelete}
                title={categoryInit}
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
                />
            )}
            {buttonsView.edit && (
                <EditDialog
                    dataTypes={datatypes}
                    category={categoryInit}
                    getInfo={handleCallback}
                    item={item}
                    link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
                    onChangeItem={handleChangeEdit}
                    onClose={handleCloseEdit}
                    open={view.edit}
                    rows={rows}
                    scope={scope}
                />
            )}
            {buttonsView.view && (
                <ViewDialog
                    category={categoryInit}
                    item={item}
                    link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
                    onChangeItem={handleChangeView}
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
    noLink: false,
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
    fields: PropTypes.string.isRequired,
    noLink: PropTypes.bool,
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