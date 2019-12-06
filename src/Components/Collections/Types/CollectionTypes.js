import React from 'react';
import PropTypes from 'prop-types';

import AddTypeDialog from './AddTypeDialog';
import EditTypeDialog from './EditTypeDialog';
import {TypeActions} from '../../../Stores';
import {ChipsCard} from '../../Util';

const tag = '10';

const CollectionTypes = ({scope}) => {
    const [customTypes, setCustomTypes] = React.useState({});

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
        '{}',
        '{any}',
        '{thing}',
        ...Object.keys(customTypes).map((v, i)=>(`{${v}}`)),
    ];

    const datatypesMap = [
        ...typesOptional,
        ...listOptional,
        ...set
    ];


    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);

    const [index, setindex] = React.useState(null);
    React.useLayoutEffect(() => {
        TypeActions.getTypes(scope, tag, handleTypes);

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
    const handleClickDelete = (i, cb) => {
        const item = typesArr[i];
        TypeActions.deleteType(
            scope,
            item.name,
            tag,
            (t) => {
                cb();
                handleTypes(t);
            }
        );
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
            <AddTypeDialog open={openAdd} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} cb={handleTypes} />
            <EditTypeDialog open={openEdit} onClose={handleCloseEdit} customType={index!=null?typesArr[index]:{}} dataTypes={datatypesMap} scope={scope} cb={handleTypes} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,
};

export default CollectionTypes;