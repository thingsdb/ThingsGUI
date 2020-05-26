import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {CollectionTypesTAG} from '../../../constants';
import {EnumActions, TypeActions, TypeStore} from '../../../Stores';
import EnumTypeChips from '../CollectionsUtils/TypesEnumsUtils/EnumTypeChips';


const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = CollectionTypesTAG;

const CollectionEnumsTypes = ({scope, customTypes}) => {
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


    const [viewType, setViewType] = React.useState({
        add: false,
        edit: false,
        name: ''
    });
    const [viewEnum, setViewEnum] = React.useState({
        add: false,
        edit: false,
        name: ''
    });

    const handleChange = (a, c, n) => {
        if (c=='type') {
            setViewEnum({...viewEnum, [a]: false, name: ''});
            setViewType({...viewType, [a]: true, name: n});
        } else {
            setViewType({...viewType, [a]: false, name: ''});
            setViewEnum({...viewEnum, [a]: true, name: n});
        }

    };

    const handleClose = (a, c) => {
        if (c=='type') {
            setViewType({...viewType, [a]: false, name: ''});
        } else {
            setViewEnum({...viewEnum, [a]: false, name: ''});
        }
    };

    console.log(viewType, viewEnum)

    return (
        <React.Fragment>
            <EnumTypeChips
                buttonsView={{add: true, edit: true, run: false, view: false}}
                categoryInit="type"
                datatypes={datatypesMap}
                fields="fields"
                onChange={handleChange}
                onClose={handleClose}
                onDelete={TypeActions.deleteType}
                onInfo={TypeActions.getTypes}
                scope={scope}
                tag={tag}
                view={viewType}
            />
            <EnumTypeChips
                buttonsView={{add: true, edit: true, run: false, view: false}}
                categoryInit="enum"
                fields="members"
                noLink
                onChange={handleChange}
                onClose={handleClose}
                onDelete={EnumActions.deleteEnum}
                onInfo={EnumActions.getEnums}
                scope={scope}
                tag={tag}
                view={viewEnum}
            />
        </React.Fragment>
    );
};

CollectionEnumsTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionEnumsTypes);