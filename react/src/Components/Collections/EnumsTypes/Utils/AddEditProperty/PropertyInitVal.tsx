import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';

import PropertyVal from './PropertyVal';


const PropertyInitVal = ({category, onChange, scope}: Props) => {
    const [switchInit, setSwitchInit] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchInit(checked);
        if (!checked) {
            onChange({propertyVal:'', propertyBlob: '',});
        }
    };

    const handleVal = (v) => {
        onChange(v);
    };

    return (
        <React.Fragment>
            <Grid size={12}>
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchInit}
                            color="primary"
                            id="switchInit"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Add initial value or closure"
                />
            </Grid>
            <Collapse in={switchInit} timeout="auto" unmountOnExit sx={{width: '100%'}}>
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

interface Props {
    category: string;
    onChange: (d: object) => void;
    scope: string;
}