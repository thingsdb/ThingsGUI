/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {AutoSelect} from '../../../../Util';


const PropertyType = ({cb, dropdownItems, input}) => {
    const handlePropertyType = (t) => {
        cb({propertyType:t});
    };

    return (
        <AutoSelect cb={handlePropertyType} dropdownItems={dropdownItems} input={input} label="Definition" />
    );
};

PropertyType.defaultProps = {
    dropdownItems: [],
};

PropertyType.propTypes = {
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.string.isRequired,
};

export default PropertyType;


