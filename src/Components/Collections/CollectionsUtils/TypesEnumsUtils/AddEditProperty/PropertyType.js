import PropTypes from 'prop-types';
import React from 'react';

import {AutoSelect} from '../../../../Util';


const PropertyType = ({onType, dropdownItems, input}) => {
    const handlePropertyType = (t) => {
        onType({propertyType:t});
    };

    return (
        <AutoSelect onVal={handlePropertyType} dropdownItems={dropdownItems} input={input} label="Definition" />
    );
};

PropertyType.defaultProps = {
    dropdownItems: [],
};

PropertyType.propTypes = {
    onType: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.string.isRequired,
};

export default PropertyType;


