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
    const [index, setIndex] = React.useState(0);
    const [scopesObj, scopeNames] = getScopes2(collections, nodes);

    React.useEffect(() => {
        const index = scope==''?scopeNames.findIndex(i=>i.includes('collection')):scopeNames.indexOf(scope);
        setIndex(index);
        onChangeScope(scopesObj[index]);
    }, []);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setIndex(value);
        onChangeScope(scopesObj[value]);
    };

    return (
        <HarmonicCard
            expand={false}
            title="SCOPE"
            content={
                <RadioGroup aria-label="scope" name="scope" value={`${index}`} onChange={handleOnChangeScope}>
                    {scopesObj.map((s, i) => (
                        <FormControlLabel key={s.value} value={`${i}`} control={<Radio color='primary' />} label={s.value} />
                    ))}
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