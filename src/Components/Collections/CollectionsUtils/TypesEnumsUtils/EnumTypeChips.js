/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ChipsCard} from '../../../Util';
import {AddDialog, EditDialog, ViewDialog} from '.';


const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));


const TypeChips = ({buttonsView, categoryInit, datatypes, headers, onChange, onClose, onDelete, onInfo, onMakeInstanceInit, onSetQueryInput, queries, rows, scope, tag, view}) => {
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
        onChange('add', '', categoryInit);
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

    const buttons = (bv) => (n)=>{
        let b = [];
        if (bv.view) {
            b.push({
                icon: <ViewIcon fontSize="small" />,
                onClick: onChange('view')(n, c),
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
                onClick: onChange('edit')(n, c),
            });
        }

        return b;
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

TypeChips.defaultProps = {
    datatypes: [],
    onChange: ()=>null,
    onClose: ()=>null,
    onDelete: ()=>null,
    onInfo: ()=>null,
    onMakeInstanceInit: ()=>null,
    onSetQueryInput: ()=>null,
};

TypeChips.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    categoryInit: PropTypes.string.isRequired,
    datatypes: PropTypes.arrayOf(PropTypes.string),
    headers: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onInfo: PropTypes.func,
    onMakeInstanceInit: PropTypes.func,
    onSetQueryInput: PropTypes.func,
    queries: PropTypes.func.isRequired,
    rows: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    view: PropTypes.object.isRequired,
};

export default EnumTypeChips;