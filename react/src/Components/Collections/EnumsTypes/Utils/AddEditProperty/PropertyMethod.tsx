import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {Closure} from '../../../../Utils';

const PropertyMethod = ({onChange, input}) => {

    const handleClosure = (c) => {
        onChange({definition:c});
    };

    return (
        <React.Fragment>
            <Typography variant="caption">
                {'Definition'}
            </Typography>
            <Closure input={input} onChange={handleClosure} />
        </React.Fragment>
    );
};

PropertyMethod.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default PropertyMethod;


