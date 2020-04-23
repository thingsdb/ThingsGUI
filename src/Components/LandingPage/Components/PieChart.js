import PropTypes from 'prop-types';
import React from 'react';

import Pie from './Pie';


const PieChart = ({width, height, radius, data, backgroundColor, title}) => {
    console.log('hoi');
    return(
          <svg width={width} height={height}>
            <text x={width/2-(title.length*11)/2} y={35} fill="white" style={{fontSize:'18px', fontFamily:'monospace'}}>
                {title}
            </text>
            <Pie
                data={ data }
                hole={ 50 }
                showLabels={ true }
                showPercent={ true }
                radius={ radius }
                stroke={ backgroundColor }
                strokeWidth={ 5 }
                offset={{x: 0, y: 50}}
            />
        </svg>
    );
};


PieChart.defaultProps = {
    width: 300,
    height: 450,
    radius: 145,
};

PieChart.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    backgroundColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};


export default PieChart;

