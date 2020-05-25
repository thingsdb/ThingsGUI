import PropTypes from 'prop-types';
import React from 'react';

import Piece from './Piece';

const colors = [
    '#43A19E', '#58CF6C', '#FF9824', '#F2317A', '#7B43A1',
    '#89B3B2', '#A8D2AF', '#D6A46D', '#84304F', '#9D74B9',
    '#7EDEDB', '#7AFF91', '#F7D3AB', '#CA9CAD', '#DDB0FB',
    '#1B5856', '#377B43', '#BB6F19', '#A5154B', '#40185A'];

const minFrac = 0.05;
let charWidth = 11;
let legendLineHeight = 25;

const PieChart = ({data, hole, offset, radius, showLabels, showPercent, stroke, strokeWidth, title}) => {
    let colorsLength = colors.length;
    let total = data.reduce((res, item) => { res += item.number  ; return res;}, 0);
    let start = 0;
    let diameter = 2*radius;


    let {d, other} = data.reduce((res, item) => {
        if((item.number/total)>minFrac) {
            res.d.push(item);
        } else {
            res.other.number += item.number;
        }
        return res;
    }, { d: [], other: {title: 'Other (<5%)', number: 0} });

    let dother = other.number ? [...d, other] : d;
    let width = 2*diameter+10;
    let height = diameter+85;


    const legendy = (y, lineNumber) => y + offset.y+lineNumber/2*legendLineHeight;


    return(
        <svg width={width} height={height}>
            <text x={width/2-(title.length*charWidth)/2} y={35} fill="white" style={{fontSize:'18px', fontFamily:'monospace'}}>
                {title}
            </text>
            {dother.map((piece, i) => {
                let next = start;
                let fraction = (piece.number / total);
                start += fraction;

                return(
                    <React.Fragment key={i}>
                        <Piece
                            fill={colors[i % colorsLength]}
                            fraction={fraction}
                            hole={radius - hole}
                            offset={offset}
                            radius={radius}
                            showLabel={showLabels}
                            showPercent={showPercent}
                            start={next}
                            stroke={stroke}
                            strokeWidth={strokeWidth}
                            trueHole={hole}
                            value={piece.number}
                        />
                        <circle cx={i%2 ? offset.x+radius+diameter : 40+diameter} cy={i%2 ? legendy(20, i-1) : legendy(20, i)} r="10" fill={colors[i % colorsLength]} />
                        <text x={i%2 ? offset.x+radius+20+diameter : 60+diameter} y={i%2 ?  legendy(25, i-1) : legendy(25, i)} fill="white" style={{fontSize:'10px', fontFamily:'monospace'}}>
                            {piece.title}
                        </text>
                    </React.Fragment>
                );
            })}
        </svg>
    );
};


PieChart.defaultProps = {
    hole: 50,
    offset: {x:0, y: 50},
    radius: 145,
    showLabels: true,
    showPercent: false,
    strokeWidth: 5,
};

PieChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    hole: PropTypes.number,
    offset: PropTypes.object,
    radius: PropTypes.number,
    showLabels: PropTypes.bool,
    showPercent: PropTypes.bool,
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number,
    title: PropTypes.string.isRequired,
};


export default PieChart;

