import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import AddTypeDialog from './AddTypeDialog';
import EditTypeDialog from './EditTypeDialog';
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


    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const [index, setindex] = React.useState(null);
    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        TypeActions.getTypes(scope, tag);
    };

    const handleClickEdit = (i) => {
        setindex(i);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpenAdd(true);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
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

    return (
        <React.Fragment>
            <ChipsCard
                expand={false}
                items={customTypes[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onEdit={handleClickEdit}
                onRefresh={handleRefresh}
                title="custom types"
            />
            <AddTypeDialog open={openAdd} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} />
            <EditTypeDialog open={openEdit} onClose={handleCloseEdit} customType={index!=null&&customTypes[scope]?customTypes[scope][index]:{}} dataTypes={datatypesMap} scope={scope} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);