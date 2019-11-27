import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import AddTypeDialog from './AddTypeDialog';
import EditTypeDialog from './EditTypeDialog';
import {TypeActions, TypeStore} from '../../../Stores';
import {ChipsCard} from '../../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = '21';

const CollectionTypes = ({scope, customTypes}) => {
    const types = [
        'str',
        'utf8',
        'raw',
        'bytes',
        'bool',
        'int',
        'uint',
        'float',
        'number',
        'thing',
        'any',
        ...Object.keys(customTypes)
    ];

    const typesOptional = [
        ...types,
        ...types.map((v, i)=>(`${v}?`)),
    ];

    const list = [
        '[]',
        ...typesOptional.map((v, i)=>(`[${v}]`)),
    ];

    const listOptional = [
        ...list,
        ...list.map((v, i)=>(`${v}?`)),
    ];

    const set = [
        ...types.map((v, i)=>(`{${v}}`)),
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

    const typesArr = [...Object.keys(customTypes).map((name) => (
        {
            name: name,
            definition: JSON.stringify(customTypes[name]),
            properties: customTypes[name]
        }
    ))];

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
    const handleClickDelete = (i) => {
        const item = typesArr[i];
        TypeActions.deleteType(scope, item.name, tag);
    };

    return (
        <React.Fragment>
            <ChipsCard
                title="custom types"
                items={typesArr}
                onAdd={handleClickAdd}
                onClick={handleClickEdit}
                onDelete={handleClickDelete}
                tag={tag}
            />
            <AddTypeDialog open={openAdd} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} />
            <EditTypeDialog open={openEdit} onClose={handleCloseEdit} customType={index!=null?typesArr[index]:{}} dataTypes={datatypesMap} scope={scope} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);