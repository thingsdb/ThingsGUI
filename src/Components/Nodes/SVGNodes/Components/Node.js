import React from 'react';
import PropTypes from 'prop-types';

const Node = ({x, y, data, color}) => {
    return (
        <React.Fragment>
            <defs>
                <filter id="blurFilter" >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                </filter>
            </defs>
            <circle cx={x} cy={y} r="50" fill="#1b1c1d" />
            <circle cx={x} cy={y} r="45" fill={color} filter="url(#blurFilter)" />
            <circle cx={x-5} cy={y-5} r="40" fill="#f0ffff33" filter="url(#blurFilter)" />
            <circle cx={x-7} cy={y-7} r="25" fill="rgba(255,255,255, 0.2)" filter="url(#blurFilter)" />


            <text x={`${x-35}`} y={`${y+5}`} fill="white" style={{fontSize:'18px', fontFamily:'monospace'}}>
                {`node:${data.node_id}`}
            </text>
        </React.Fragment>
    );
};

Node.defaultProps = {
    data: {},
};

Node.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    data: PropTypes.object,
    color: PropTypes.string.isRequired,
};

export default Node;