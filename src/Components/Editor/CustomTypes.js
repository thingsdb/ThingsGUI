import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {ChipsCard} from '../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);


const tag = '2';

const CustomTypes = ({scope, onSetAsInput, customTypes}) => {
    React.useEffect(() => {
        if (scope&&scope.includes('@collection')) {
            TypeActions.getTypes(scope, tag);
        }
    }, [scope]);

    const typesArr = [...Object.keys(customTypes).map((name) => (
        {
            name: name,
            definition: JSON.stringify(customTypes[name])
        }
    ))];

    const makeTypeInstanceInit = (key) => customTypes[key] ?
        `${key}{${Object.entries(customTypes[key]).map(([k, v]) =>`${k}: ${makeTypeInstanceInit(v)}` )}}`
        : `<${key}>`;

    const handleClick = (index) => {
        const key = typesArr[index];
        const i = makeTypeInstanceInit(key.name);
        onSetAsInput(i);
    };

    const handleClickDelete = (index) => {
        const key = typesArr[index];
        TypeActions.deleteType(scope, key.name, tag);
    };

    const handleClickAdd = () => {
        onSetAsInput('set_type("...", {...})');
    };

    return (
        <ChipsCard
            title="custom types"
            items={typesArr}
            onAdd={handleClickAdd}
            onClick={handleClick}
            onDelete={handleClickDelete}
            tag={tag}
        />
    );
};

CustomTypes.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetAsInput: PropTypes.func.isRequired,

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CustomTypes);