/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';

import InputField from './InputField';


const StandardChild = ({cb, name, type}) => {
    const [val, setVal] = React.useState('');

    React.useEffect(() => {
        cb({name: name, type: type, val: val});
    },
    [val],
    );

    const handleVal = (v) => {
        setVal(v);
    };


    return(
        <InputField name="" dataType={type} cb={handleVal} input={val} margin="dense" />

    );
};

StandardChild.propTypes = {
    cb: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default StandardChild;