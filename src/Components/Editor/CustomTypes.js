import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {Chips} from '../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);


const tag = '2';

const CustomTypes = ({scope, onSetAsInput, customTypes}) => {
    React.useEffect(() => {
        if (!(scope == '@node' || scope == '@thingsdb' || scope == '')) {
            TypeActions.getTypes(scope, tag);
        }
    }, [scope]);

    const makeTypeInstanceInit = (key) => customTypes[key] ?
        `${key}({${Object.entries(customTypes[key]).map(([k, v]) =>`${k}: ${makeTypeInstanceInit(v)}` )}})`
        : `<${key}>`;

    const handleClickType = (index) => {
        const key = Object.keys(t)[index];
        const i = makeTypeInstanceInit(key);
        onSetAsInput(i);
    };

    const handleClickDeleteType = (index) => {
        const key = Object.keys(t)[index];
        TypeActions.deleteType(scope, key, tag);
    };

    const handleClickAddType = () => {
        onSetAsInput('new_type("...", ...)');
    };

    const t = scope == '@node' || scope == '@thingsdb' || scope == '' ? [] : customTypes;
    const typesArr = [...Object.keys(t).map((name) => (
        {
            name: name,
            definition: JSON.stringify(customTypes[name])
        }
    ))];
    console.log(typesArr);
    return (
        <Chips
            title="CUSTOM TYPES"
            items={typesArr}
            onAdd={handleClickAddType}
            onClick={handleClickType}
            onDelete={handleClickDeleteType}
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