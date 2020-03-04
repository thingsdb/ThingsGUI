/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';

import {useEdit} from '../Tree/TreeActions/Context';
import InputField from '../Tree/TreeActions/InputField';

const ProviderInputField = ({cb, customTypes, dataTypes, dataType}) => {
    const editState = useEdit()[0];
    const {val} = editState;

    React.useEffect(()=>{
        cb(val);
    },[val]);

    return (

        <InputField
            customTypes={customTypes}
            dataType={dataType}
            dataTypes={dataTypes}

            variant="outlined"
            name="propertyVal"
            label="Initial value"
            fullWidth
        />
    );
};

ProviderInputField.defaultProps = {
    customTypes: [],
    dataTypes: [],
};

ProviderInputField.propTypes = {
    cb: PropTypes.func.isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object),
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    dataType: PropTypes.string.isRequired,
};

export default ProviderInputField;


