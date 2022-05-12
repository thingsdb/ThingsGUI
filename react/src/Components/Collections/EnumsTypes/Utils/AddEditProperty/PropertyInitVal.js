import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';

import PropertyVal from './PropertyVal';


const PropertyInitVal = ({category, onChange, scope}) => {
    const [switchIni, setSwitch] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
        if (!checked) {
            onChange({propertyVal:'', propertyBlob: '',});
        }
    };

    const handleVal = (v) => {
        onChange(v);
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchIni}
                            color="primary"
                            id="switchIni"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Add initial value or closure"
                />
            </Grid>
            <Collapse in={switchIni} timeout="auto" unmountOnExit sx={{width: '100%'}}>
                <PropertyVal category={category} onChange={handleVal} scope={scope} />
            </Collapse>
        </React.Fragment>
    );
};

PropertyInitVal.propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default PropertyInitVal;


