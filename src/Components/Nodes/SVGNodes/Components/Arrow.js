import PropTypes from 'prop-types';
import React from 'react';

import './Arrow.css';


const Arrow = ({startPointX, startPointY, endPointX, endPointY}) => {

    return(
        <React.Fragment>
            <polyline points={`${startPointX},${startPointY} ${endPointX},${endPointY}`} fill="none" stroke="lightsteelblue" strokeWidth={5} strokeLinecap="round" />
            <polyline className="path" points={`${startPointX},${startPointY} ${endPointX},${endPointY}`} fill="none" stroke="#3a5985" markerEnd="url(#arrow)" strokeWidth={3} strokeLinecap="round" />
            <marker id="arrow" viewBox="0 0 10 10" refX="33" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" stroke="lightsteelblue" fill="lightsteelblue" strokeLinecap="round" />
            </marker>
        </React.Fragment>
    );
};

Arrow.propTypes = {
    startPointX: PropTypes.number.isRequired,
    startPointY: PropTypes.number.isRequired,
    endPointX: PropTypes.number.isRequired,
    endPointY: PropTypes.number.isRequired,
};

export default Arrow;
