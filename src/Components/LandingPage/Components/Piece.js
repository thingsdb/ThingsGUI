import PropTypes from 'prop-types';
import React from 'react';

function getAnglePoint(fraction, radius, rx, ry) {
	var x, y;

	x = rx + radius * Math.cos(2*Math.PI * fraction);
	y = ry + radius * Math.sin(2*Math.PI * fraction);

	return { x, y };
};


const Piece = ({fill, fraction, hole, offset, radius, showLabel, showPercent, start, stroke, strokeWidth, trueHole, value}) => {
    const [textPoint, setTextPoint] = React.useState({
        x: 0,
        y: 0
    });
    const [path, setPath] = React.useState('');
    const [part, setPart] = React.useState(0);

    let startA = getAnglePoint(start, radius, radius+offset.x, radius+offset.y);
    let startB = getAnglePoint(start, radius - hole, radius+offset.x, radius+offset.y);

	React.useEffect(() => {
        animate();
    }, []);

	const animate = () => {
		draw(0);
    }

	const draw = (s) => {

		let step = fraction / 20;

		if (s + step > fraction) {
            s = fraction;
		}

        // Get angle points
        let endA = getAnglePoint(start + s, radius, radius+offset.x, radius+offset.y);
        let endB = getAnglePoint(start + s, radius - hole, radius+offset.x, radius+offset.y);

        let p = `M ${startA.x} ${startA.y} A ${radius} ${radius} 0 ${(s > 0.5 ? 1 : 0)} 1 ${endA.x} ${endA.y} L ${endB.x} ${endB.y} A ${radius- hole} ${radius- hole} 0 ${(s > 0.5 ? 1 : 0)} 0 ${startB.x} ${startB.y} Z`;

		if (s < fraction) {
			setTimeout(() => { draw(s + step) } , 10);
		} else if (showLabel) {
			let c = getAnglePoint(start + (fraction / 2), (radius / 2 + trueHole / 2), radius+offset.x, radius+offset.y);
			setTextPoint({x: c.x, y: c.y});
        }
        setPath(p);
        setPart(s);
    };

    return (
        <g overflow="hidden">
            { fraction == 1 && part == 1 ? (
                <React.Fragment>
                    <circle
                        cx={radius+offset.x}
                        cy={radius+offset.y}
                        r={radius}
                        fill={ fill }
                        stroke={ stroke }
                        strokeWidth={ strokeWidth ? strokeWidth : 4 }
                    />
                    <circle
                        cx={radius+offset.x}
                        cy={radius+offset.y}
                        r={hole/2}
                        fill={ stroke }
                        stroke={ stroke }
                        strokeWidth={ strokeWidth ? 2*strokeWidth : 8 }
                    />
                </React.Fragment>
            ) : (
                <path
                    d={ path }
                    fill={ fill }
                    stroke={ stroke }
                    strokeWidth={ strokeWidth ? strokeWidth : 4 }
                />
            )}
            { showLabel && fraction > 0.05 ?
                <text x={ textPoint.x } y={ textPoint.y } fill="#fff" textAnchor="middle"style={{fontSize:'12px', fontFamily:'monospace'}} >
                    { showPercent ? (fraction*100).toFixed(1) + '%' : value }
                </text>
            : null }
        </g>
    );
};

Piece.propTypes = {
    fill: PropTypes.string.isRequired,
    fraction: PropTypes.number.isRequired,
    hole: PropTypes.number.isRequired,
    offset: PropTypes.object.isRequired,
    radius: PropTypes.number.isRequired,
    showLabel: PropTypes.bool.isRequired,
    showPercent: PropTypes.bool.isRequired,
    start: PropTypes.number.isRequired,
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    trueHole: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default Piece;
