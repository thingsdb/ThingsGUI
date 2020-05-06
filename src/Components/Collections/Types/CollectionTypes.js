import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {AddTypeDialog, EditTypeDialog, ViewTypeDialog} from './Dialogs';
import {TypeActions, TypeStore} from '../../../Stores';
import {ChipsCard} from '../../Util';

const tag = '10';


const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const CollectionTypes = ({scope, customTypes}) => {
    const types = [
        'str',
        'utf8',
        'raw',
        'bytes',
        'bool',
        'int',
        'pint',
        'nint',
        'uint',
        'float',
        'number',
        'thing',
        'any',
        ...(customTypes[scope]||[]).map(c=>c.name)
    ];

    const typesOptional = [
        ...types,
        ...types.map(v=>`${v}?`),
    ];

    const list = [
        '[]',
        ...typesOptional.map(v=>`[${v}]`),
    ];

    const listOptional = [
        ...list,
        ...list.map(v=>`${v}?`),
    ];

    const set = [
        '{}',
        '{any}',
        '{thing}',
        ...(customTypes[scope]||[]).map(c=>`{${c.name}}`),
    ];

    const datatypesMap = [
        ...typesOptional,
        ...listOptional,
        ...set
    ];


    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        view: false,
    });
    const {add, edit, view} = open;

    const [index, setindex] = React.useState(null);
    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        TypeActions.getTypes(scope, tag);
    };

    const handleClickEdit = (i) => () => {
        setindex(i);
        setOpen({...open, edit: true});
    };
    const handleCloseEdit = () => {
        setOpen({...open, edit: false});
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpen({...open, add: true});
    };
    const handleCloseAdd = () => {
        setOpen({...open, add: false});
    };
    const handleClickDelete = (i, cb, tag) => {
        const item = customTypes[scope][i];
        TypeActions.deleteType(
            scope,
            item.name,
            tag,
            () => {
                cb();
            }
        );
    };

    const buttons = (index)=>([
        {
            icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
            onClick: handleClickEdit(index),
        },
    ]);

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={customTypes[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title="custom types"
            />
            <AddTypeDialog open={add} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} />
            <EditTypeDialog open={edit} onClose={handleCloseEdit} customType={index!=null&&customTypes[scope]?customTypes[scope][index]:{}} dataTypes={datatypesMap} scope={scope} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);