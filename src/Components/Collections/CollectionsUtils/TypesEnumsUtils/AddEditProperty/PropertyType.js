import PropTypes from 'prop-types';
import React from 'react';

import {AutoSelect} from '../../../../Util';


const PropertyType = ({onChange, dropdownItems, input}) => {
    const handlePropertyType = (t) => {
        onChange({propertyType:t});
    };

    return (
        <AutoSelect onChange={handlePropertyType} dropdownItems={dropdownItems} input={input} label="Definition" />
    );
};

PropertyType.defaultProps = {
    dropdownItems: [],
};

PropertyType.propTypes = {
    onChange: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.string.isRequired,
};

export default PropertyType;


