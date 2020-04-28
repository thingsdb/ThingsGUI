import PropTypes from 'prop-types';
import React from 'react';

import Pie from './Pie';


const PieChart = ({backgroundColor, data, height, radius, showPercent, title, width}) => {
    return(
          <svg width={width} height={height}>
            <text x={width/2-(title.length*11)/2} y={35} fill="white" style={{fontSize:'18px', fontFamily:'monospace'}}>
                {title}
            </text>
            <Pie
                data={ data }
                hole={ 50 }
                showLabels={ true }
                showPercent={ showPercent }
                radius={ radius }
                stroke={ backgroundColor }
                strokeWidth={ 5 }
                offset={{x: 0, y: 50}}
            />
        </svg>
    );
};


PieChart.defaultProps = {
    height: 450,
    radius: 145,
    showPercent: false,
    width: 300,
};

PieChart.propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    height: PropTypes.number,
    radius: PropTypes.number,
    showPercent: PropTypes.bool,
    title: PropTypes.string.isRequired,
    width: PropTypes.number,
};


export default PieChart;

