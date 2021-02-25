/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NativeSelect from '@material-ui/core/NativeSelect';
import PropTypes from 'prop-types';
import React from 'react';

import {NodesStore, ThingsdbStore} from '../../Stores';
import {getScopes2} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);

const useStyles = makeStyles(theme => ({
    icon: {
        color: theme.palette.primary.main,
    },
    input: {
        color: theme.palette.primary.main,
        fontSize: '1.5rem',
    }
}));

const SelectScope = ({onChangeScope, scope, collections, nodes}) => {
    const classes = useStyles();
    const [name, setName] = React.useState(scope|| collections[0] ? `@collection:${collections[0].name}` : '@thingsdb');
    const scopes = getScopes2(collections, nodes);

    React.useEffect(()=> {
        let name = scope|| collections[0] ? `@collection:${collections[0].name}` : '@thingsdb';
        onChangeScope(scopes.find(i=>i===name)||'');
    }, []);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setName(value);
        onChangeScope(scopes.find(i=>i===value)||'');
    };

    return (
        <NativeSelect
            classes={{
                icon: classes.icon
            }}
            disableUnderline
            IconComponent={ExpandMore}
            id="scope"
            inputProps={{
                style: {
                    color:'#3a6394',
                    fontSize: '1.5rem',
                }
            }}
            onChange={handleOnChangeScope}
            style={{lineHeight: '2rem'}}
            value={name}
            variant="outlined"
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
    scope: PropTypes.string.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
    /* Nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(SelectScope);