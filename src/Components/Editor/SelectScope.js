/* eslint-disable react-hooks/exhaustive-deps */
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import {NodesStore, ThingsdbStore} from '../../Stores';
import {getScopes2, HarmonicCard} from '../Util';

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
        <HarmonicCard
            expand={false}
            title="SCOPE"
            content={
                <RadioGroup aria-label="scope" name="scope" value={name} onChange={handleOnChangeScope}>
                    {scopesObj.map(s => <FormControlLabel key={s.value} value={s.value} control={<Radio color='primary' />} label={s.value} />)}
                </RadioGroup>
            }
        />
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