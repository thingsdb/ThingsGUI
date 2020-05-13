import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {AddTypeDialog, EditTypeDialog} from './Dialogs';
import {TypeActions, TypeStore} from '../../../Stores';
import {ChipsCard} from '../../Util';
import {CollectionTypesTAG} from '../../../constants';


const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = CollectionTypesTAG;

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
    });
    const {add, edit} = open;

    const [name, setName] = React.useState('');
    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        TypeActions.getTypes(scope, tag);
    };

    const handleChangeType = (n) => {
        setName(n);
    };
    const handleClickEdit = (n) => () => {
        setName(n);
        setOpen({...open, edit: true});
    };
    const handleCloseEdit = () => {
        setOpen({...open, edit: false});
    };

    const handleClickAdd = () => {
        setName('');
        setOpen({...open, add: true});
    };
    const handleCloseAdd = () => {
        setOpen({...open, add: false});
    };
    const handleClickDelete = (n, cb, tag) => {
        TypeActions.deleteType(
            scope,
            n,
            tag,
            () => {
                cb();
            }
        );
    };

    const buttons = (n)=>([
        {
            icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
            onClick: handleClickEdit(n),
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
            <EditTypeDialog open={edit} onChangeType={handleChangeType} onClose={handleCloseEdit} customType={name&&customTypes[scope]?customTypes[scope].find(i=>i.name==name):{}} dataTypes={datatypesMap} customTypeNames={[...(customTypes[scope]||[]).map(c=>c.name)]} scope={scope} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);