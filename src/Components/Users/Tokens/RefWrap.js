/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';



const RefWrap = ({children}) => {
    const reference = React.useRef(null);

    return (
        children(reference)
    );
};

// RefWrap.propTypes = {
//     cb: PropTypes.func.isRequired,
// };

export default RefWrap;