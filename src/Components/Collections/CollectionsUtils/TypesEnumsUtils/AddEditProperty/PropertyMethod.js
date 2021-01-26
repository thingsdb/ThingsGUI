import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {Closure} from '../../../../Util';

const PropertyMethod = ({cb, input}) => {

    const handleClosure = (c) => {
        cb({definition:c});
    };

    return (
        <React.Fragment>
            <Typography variant="caption">
                {'Definition'}
            </Typography>
            <Closure input={input} cb={handleClosure} />
        </React.Fragment>
    );
};

PropertyMethod.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default PropertyMethod;


