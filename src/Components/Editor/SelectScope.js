/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import {withVlow} from 'vlow';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NativeSelect from '@material-ui/core/NativeSelect';
import PropTypes from 'prop-types';
import React from 'react';

import {NodesStore, ThingsdbStore} from '../../Stores';
import {getScopes2, historyDeleteQueryParam, historyGetQueryParam, historySetQueryParam} from '../Util';
import {COLLECTION_SCOPE, THINGSDB_SCOPE} from '../../Constants/Scopes';

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

const SelectScope = ({onChangeScope, collections, nodes}) => {
    let history = useHistory();
    const classes = useStyles();
    const scopes = getScopes2(collections, nodes);
    const [name, setName] = React.useState(() => {
        let scopeParam = historyGetQueryParam(history, 'scope');
        if (scopeParam) {
            return scopeParam;
        }
        return collections[0] ? `${COLLECTION_SCOPE}:${collections[0].name}` : THINGSDB_SCOPE;
    });

    React.useEffect(()=> {
        onChangeScope(scopes.find(n => n === name) || '');
    }, [name]);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        if (value !== '') {
            historySetQueryParam(history, 'scope', value);
        }
        else {
            historyDeleteQueryParam(history, 'scope');
        }
        setName(value);
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

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
    /* Nodes properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(SelectScope);