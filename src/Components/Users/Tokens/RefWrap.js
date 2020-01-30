/* eslint-disable react/no-multi-comp */
import React from 'react';



const RefWrap = ({children}) => {
    const reference = React.useRef(null);

    return (
        children(reference)
    );
};

export default RefWrap;