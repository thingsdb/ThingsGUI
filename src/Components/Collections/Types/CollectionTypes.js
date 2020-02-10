import React from 'react';
import PropTypes from 'prop-types';

import AddTypeDialog from './AddTypeDialog';
import EditTypeDialog from './EditTypeDialog';
import {TypeActions} from '../../../Stores';
import {ChipsCard} from '../../Util';

const tag = '10';

const CollectionTypes = ({scope}) => {
    const [customTypes, setCustomTypes] = React.useState([]);

    const handleTypes = (t) => {
        setCustomTypes(t);
    };

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
        ...customTypes.map(c=>c.name)
    ];

    const typesOptional = [
        ...types,
        ...types.map((v)=>(`${v}?`)),
    ];

    const list = [
        '[]',
        ...typesOptional.map((v)=>(`[${v}]`)),
    ];

    const listOptional = [
        ...list,
        ...list.map((v)=>(`${v}?`)),
    ];

    const set = [
        '{}',
        '{any}',
        '{thing}',
        ...customTypes.map(c=>`{${c.name}}`),
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
        TypeActions.getTypes(scope, tag, handleTypes);

    }, [scope]);

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
    const handleClickDelete = (i, cb) => {
        const item = customTypes[i];
        TypeActions.deleteType(
            scope,
            item.name,
            '27',
            (t) => {
                cb();
                handleTypes(t);
            }
        );
    };

    return (
        <React.Fragment>
            <ChipsCard
                expand={false}
                items={customTypes}
                onAdd={handleClickAdd}
                onClick={handleClickEdit}
                onDelete={handleClickDelete}
                title="custom types"
            />
            <AddTypeDialog open={openAdd} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} cb={handleTypes} />
            <EditTypeDialog open={openEdit} onClose={handleCloseEdit} customType={index!=null?customTypes[index]:{}} dataTypes={datatypesMap} scope={scope} cb={handleTypes} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,
};

export default CollectionTypes;