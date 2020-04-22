import PropTypes from 'prop-types';
import React from 'react';

import Pie from './Pie';


const PieChart = ({width, height, radius, data, backgroundColor, title}) => {

    return(
          <svg width={width} height={height}>
            <Pie
                data={ data }
                hole={ 50 }
                showLabels={ true }
                showPercent={ true }
                radius={ radius }
                stroke={ backgroundColor }
                strokeWidth={ 5 }
            />
        </svg>
    );
};


PieChart.defaultProps = {
    width: 300,
    height: 350,
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

