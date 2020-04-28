import PropTypes from 'prop-types';
import React from 'react';

import Piece from './Piece';

const colors = [
    '#43A19E', '#58CF6C', '#FF9824', '#F2317A', '#7B43A1', '#219ef9', '#89afe0',
    '#51719d', '#3a5985', '#aa2e25', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#1769aa', '#0276aa', '#008394', '#00695f', '#357a38', '#618833', '#8f9a27',
    '#f6685e', '#6d1b7b', '#482880', '#6573c3', '#4dabf5', '#35baf6', '#33c9dc',
    '#33ab9f', '#6fbf73', '#a2cf6e', '#b28704', '#b26a00', '#b23c17', '#a31545',
    '#ed4b82', '#af52bf', '#8561c5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#8bc34a', '#ff5722']

const Pie = ({ data, hole, offset, radius, showLabels, showPercent, stroke, strokeWidth}) => {

    let colorsLength = colors.length;

    const total = data.reduce((res, item) => { res += item.number  ; return res;}, 0);
    let start = 0;

    return (
        data.map((piece, i) => {
            let next = start;
            let fraction = (piece.number / total);
            start += fraction;

            return(
                <React.Fragment key={i}>
                    <Piece
                        fill={colors[i % colorsLength]}
                        fraction={fraction}
                        hole={radius - hole}
                        offset = {offset}
                        radius={radius}
                        showLabel= {showLabels}
                        showPercent={showPercent}
                        start={next}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        trueHole={hole}
                        value={piece.number}
                    />
                    <circle cx={i%2 ? offset.x+radius : 20 } cy={i%2 ? 20+offset.y+2*radius+(i-1)/2*25 : 20+offset.y+2*radius+i/2*25} r="10" fill={colors[i % colorsLength]} />
                    <text x={i%2 ? offset.x+radius+20 : 40} y={i%2 ?  25+offset.y+2*radius+(i-1)/2*25 : 25+offset.y+2*radius+i/2*25} fill="white" style={{fontSize:'10px', fontFamily:'monospace'}}>
                        {piece.title}
                    </text>
                </React.Fragment>
            );
        })
    );

};

Pie.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    hole: PropTypes.number.isRequired,
    offset: PropTypes.object.isRequired,
    radius: PropTypes.number.isRequired,
    showLabels: PropTypes.bool.isRequired,
    showPercent: PropTypes.bool.isRequired,
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired
};


export default Pie;

// const x = (a) => radius+Math.cos(a*2*Math.PI)*radius;
// const y = (a) => radius+Math.sin(a*2*Math.PI)*radius;
// const total = data.reduce((res, item) => { res += item.number  ; return res;}, 0);

// const d = data.reduce((res, item, i) => {
//     let perc = item.number/total;
//     res[item.title] = {
//         center: {
//             x: width/2,
//             y: height/2},
//         end: i==0 ? {
//             x: x(perc),
//             y: y(perc)
//         } : {
//             x: x(perc+res[data[i-1].title].perc),
//             y: y(perc+res[data[i-1].title].perc)},
//         start: i==0 ? {
//             x: (width/2)+radius,
//             y: height/2
//         } : res[data[i-1].title].end,
//         largeArcFlag: perc > 0.5 ? 1 : 0,
//         sweepFlag: 1,
//         color: colors[i],
//         perc: i==0? perc : perc + res[data[i-1].title].perc

//     };
//     return res;
// }, {});