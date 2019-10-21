import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import {ThingsdbStore} from '../../Stores/ThingsdbStore';
import {getScopes, HarmonicCard} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const SelectScope = ({onChangeScope, scope, collections}) => {
    const [index, setIndex] = React.useState(0);
    const [scopesObj, scopeNames] = getScopes(collections);

    React.useEffect(() => {
        const index = scope==''?0:scopeNames.indexOf(scope);
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
            title="SCOPE"
            content={
                <RadioGroup aria-label="scope" name="scope" value={`${index}`} onChange={handleOnChangeScope}>
                    {scopesObj.map((s, i) => (
                        <FormControlLabel key={s.value} value={`${i}`} control={<Radio color='primary' />} label={s.name} />
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
};

export default withStores(SelectScope);