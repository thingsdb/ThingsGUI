import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';

import PropertyVal from './PropertyVal';


const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%',
    },
}));

const PropertyInitVal = ({category, onChange, onBlob, scope}) => {
    const classes = useStyles();
    const [switchIni, setSwitch] = React.useState(false);

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
        if (!checked) {
            onChange({propertyVal:''});
        }
    };

    const handleVal = (v) => {
        onChange(v);
    };

    const handleBlob = (b) => {
        onBlob(b);
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
            <Collapse className={classes.fullWidth} in={switchIni} timeout="auto" unmountOnExit>
                <PropertyVal category={category} onChange={handleVal} onBlob={handleBlob} scope={scope} />
            </Collapse>
        </React.Fragment>
    );
};

PropertyInitVal.propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default PropertyInitVal;


