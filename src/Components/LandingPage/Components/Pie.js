import PropTypes from 'prop-types';
import React from 'react';

import Piece from './Piece';


const colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
const Pie = ({ data, hole, radius, showLabels, showPercent, stroke, strokeWidth}) => {

    let colorsLength = colors.length;

    const total = data.reduce((res, item) => { res += item.number  ; return res;}, 0);
    let start = 0;


    return (
        data.map(function (piece, i) {
            let next = start;
            let fraction = (piece.number / total);
            start += fraction;

            return(
                <Piece
                    key={ i }
                    value={ piece.number }
                    showPercent={ showPercent }
                    fraction={ fraction }
                    start={ next }
                    radius={ radius }
                    hole={ radius - hole }
                    trueHole={ hole }
                    showLabel= { showLabels }
                    fill={ colors[i % colorsLength] }
                    stroke={ stroke }
                    strokeWidth={ strokeWidth }
                    offset = {{x: 0, y: 50}}
                />
            );
        })
    );

};

Pie.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    hole: PropTypes.number.isRequired,
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