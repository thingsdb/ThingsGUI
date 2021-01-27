import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {Closure} from '../../../../Util';

const PropertyMethod = ({onMethod, input}) => {

    const handleClosure = (c) => {
        onMethod({definition:c});
    };

    return (
        <React.Fragment>
            <Typography variant="caption">
                {'Definition'}
            </Typography>
            <Closure input={input} onClosure={handleClosure} />
        </React.Fragment>
    );
};

PropertyMethod.propTypes = {
    onMethod: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
};

export default PropertyMethod;


