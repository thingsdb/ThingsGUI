import React from 'react';
import PropTypes from 'prop-types';

import {TypeActions} from '../../Stores';
import {ChipsCard} from '../Util';

const tag = '12';

const CustomTypes = ({scope, onSetAsInput}) => {
    const [customTypes, setCustomTypes] = React.useState({});

    const handleTypes = (t) => {
        setCustomTypes(t);
    };

    React.useLayoutEffect(() => {
        if (scope&&scope.includes('@collection')) {
            TypeActions.getTypes(scope, tag, handleTypes);
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
        TypeActions.deleteType(scope, key.name, tag, handleTypes);
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
};

export default CustomTypes;