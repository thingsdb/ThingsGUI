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

const SelectScope = ({collections, onChangeScope}) => {
    const [index, setIndex] = React.useState(0);
    const scopes = getScopes(collections);

    React.useEffect(() => {
        onChangeScope(scopes[0]);
    }, []);

    const handleOnChangeScope = ({target}) => {
        const {value} = target;
        setIndex(value);
        onChangeScope(scopes[value]);
    };

    return (
        <HarmonicCard
            title="SCOPE"
            content={
                <RadioGroup aria-label="scope" name="scope" value={`${index}`} onChange={handleOnChangeScope}>
                    {scopes.map((s, i) => (
                        <FormControlLabel key={s.value} value={`${i}`} control={<Radio color='primary' />} label={s.name} />
                    ))}
                </RadioGroup>
            }
        />
    );
};

SelectScope.propTypes = {
    onChangeScope: PropTypes.func.isRequired,

    /* Collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(SelectScope);