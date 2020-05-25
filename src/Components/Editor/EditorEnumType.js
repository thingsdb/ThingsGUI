/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ChipsCard} from '../Util';
import {AddLink, ViewDialog} from '../Collections/CollectionsUtils/TypesEnumsUtils';

const EditorEnumType = ({addInput, categoryInit, fields, noLink, onChange, onCloseView, onDeleteItem, onInfo, onMakeInstanceInit, onSetQueryInput, scope, tag, view}) => {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        handleRefresh();
    }, [scope]);

    const handleItems = (t) => {
        setItems(t);
    };

    const handleRefresh = () => onInfo(scope, tag, handleItems);

    const handleClickDelete = (n, cb, tag) => {
        onDeleteItem(
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
        onSetQueryInput(addInput);
    };

    const handleClickView = (n) => () => {
        onChange(n, categoryInit);
    };

    const handleChangeView = (n, c) => {
        onCloseView();
        onChange(n, c);
    };

    const handleCloseView = () => {
        onCloseView();
    };

    const buttons = (fnView, fnRun) => (n)=>([
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: fnView(n),
        },
        {
            icon: <RunIcon fontSize="small" />,
            onClick: fnRun(n),
        },
    ]);

    const item = view.name&&items?items.find(i=>i.name==view.name):{};
    const rows = item[fields]? item[fields].map(c=>({propertyName: c[0], propertyObject: noLink ? c[1] : <AddLink name={c[1]} scope={scope} onChange={handleChangeView} />})):[];

    return (
        <Grid item xs={12}>
            <ChipsCard
                buttons={buttons(handleClickView, handleClickRun)}
                expand={false}
                items={items}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                onDelete={handleClickDelete}
                title={categoryInit}
            />
            <ViewDialog
                category={categoryInit}
                item={item}
                link={`https://docs.thingsdb.net/v0/data-types/${categoryInit}/`}
                onChangeItem={handleChangeView}
                onClose={handleCloseView}
                open={view.open}
                rows={rows}
                scope={scope}
            />
        </Grid>
    );
};

EditorEnumType.defaultProps = {
    noLink: false,
};

EditorEnumType.propTypes = {
    addInput: PropTypes.string.isRequired,
    categoryInit: PropTypes.string.isRequired,
    fields: PropTypes.string.isRequired,
    noLink: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onCloseView: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired,
    onMakeInstanceInit: PropTypes.func.isRequired,
    onSetQueryInput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    view: PropTypes.object.isRequired,
};

export default EditorEnumType;