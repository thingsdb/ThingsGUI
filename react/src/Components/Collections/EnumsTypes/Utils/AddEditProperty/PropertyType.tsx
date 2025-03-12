import PropTypes from 'prop-types';
import React from 'react';

import {AutoSelect} from '../../../../Utils';


const PropertyType = ({
    onChange,
    dropdownItems = [],
    input
}: Props) => {
    const handlePropertyType = (t) => {
        onChange({propertyType:t});
    };

    return (
        <AutoSelect onChange={handlePropertyType} dropdownItems={dropdownItems} input={input} label="Definition" />
    );
};

PropertyType.propTypes = {
    onChange: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.string.isRequired,
};

export default PropertyType;




interface Props {
    onChange: any;
    dropdownItems: string[];
    input: string;
}
