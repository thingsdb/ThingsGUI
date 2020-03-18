/* eslint-disable react-hooks/exhaustive-deps */
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from 'react';
import PropTypes from 'prop-types';
import NativeSelect from '@material-ui/core/NativeSelect';
import {withVlow} from 'vlow';

import {NodesStore, ThingsdbStore} from '../../Stores';
import {getScopes2} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);

const SelectScope = ({onChangeScope, scope, collections, nodes}) => {
    const [name, setName] = React.useState(scope|| collections[0] ? `@collection:${collections[0].name}` : '@thingsdb');
    const [scopesObj] = getScopes2(collections, nodes);

    React.useEffect(()=> {
        let name = scope|| collections[0] ? `@collection:${collections[0].name}` : '@thingsdb';
        onChangeScope(scopesObj.find(i=>i.value===name)||{});
    }, []);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setName(value);
        onChangeScope(scopesObj.find(i=>i.value===value)||{});
    };

    return (
        <NativeSelect
            disableUnderline
            IconComponent={ExpandMore}
            id="scope"
            inputProps={{
                style: {
                    color:'#3a6394',
                    fontSize: '2.125rem',
                },
            }}

            onChange={handleOnChangeScope}
            style={{lineHeight: '2.2rem'}}
            value={name}
            variant="outlined"
        >
            {scopesObj.map(s => (
                <option key={s.value} value={s.value}>
                    {s.value}
                </option>
            ))}
        </NativeSelect>
    );
};

SelectScope.propTypes = {
    onChangeScope: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
    /* Nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(SelectScope);