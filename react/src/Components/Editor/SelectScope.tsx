/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams } from 'react-router';
import { withVlow } from 'vlow';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NativeSelect from '@mui/material/NativeSelect';
import PropTypes from 'prop-types';
import React from 'react';

import { NodesStore, ThingsdbStore } from '../../Stores';
import { getScopes2 } from '../Utils';
import { COLLECTION_SCOPE, THINGSDB_SCOPE } from '../../Constants/Scopes';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);


const SelectScope = ({onChangeScope, collections, nodes}) => {
    let [searchParams, setSearchParams] = useSearchParams();

    const [name, setName] = React.useState(() => {
        let scopeParam = searchParams.get('scope');
        if (scopeParam) {
            return scopeParam;
        }
        return collections[0] ? `${COLLECTION_SCOPE}:${collections[0].name}` : THINGSDB_SCOPE;
    });

    const scopes = React.useMemo(() => getScopes2(collections, nodes), [collections, nodes]);

    React.useEffect(() => {
        // This useEffect is needed to guarantee that scope is updated
        // in the parent when name is updated via the searchParams.
        onChangeScope(name);
    }, [name]);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setName(value);

        let sName = scopes.includes(value) ? value : THINGSDB_SCOPE;
        const current = Object.fromEntries(searchParams);
        setSearchParams({ ...current, scope: sName });
    };

    return (
        <NativeSelect
            disableUnderline
            IconComponent={ExpandMore}
            id="scope"
            inputProps={{
                style: {
                    color:'#3a6394',
                    fontSize: '1.5rem',
                },
            }}
            onChange={handleOnChangeScope}
            style={{lineHeight: '2rem'}}
            value={name}
            variant="outlined"
            sx={{
                '& .MuiNativeSelect-icon': {
                    color: 'primary.main',
                }
            }}
        >
            {scopes.map(s => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </NativeSelect>
    );
};

SelectScope.propTypes = {
    onChangeScope: PropTypes.func.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
    /* Nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(SelectScope);