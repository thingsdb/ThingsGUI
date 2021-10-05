import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {AutoSelect} from '../../../../Utils';

const PropertyRelation = ({dropdownItems, onChange, input}) => {
    const [relation, setRelation] = React.useState(input);

    const handleProperty = (value) => {
        setRelation({...relation, property: value});
        onChange({relation: {...relation, property: value}});
    };

    const handlePropertyToo = ({target}) => {
        const {value} = target;
        setRelation({...relation, propertyToo: value});
        onChange({relation: {...relation, propertyToo: value}});
    };

    return (
        <Grid container spacing={2}>
            <Grid item>
                <AutoSelect onChange={handleProperty} dropdownItems={dropdownItems} input={relation.property} label="Property" />
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    label="Related property"
                    name="propertyToo"
                    onChange={handlePropertyToo}
                    spellCheck={false}
                    type="text"
                    value={relation.propertyToo}
                    variant="standard"
                />
            </Grid>
        </Grid>
    );
};

PropertyRelation.propTypes = {
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
};

export default PropertyRelation;


