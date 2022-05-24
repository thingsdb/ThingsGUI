import PropTypes from 'prop-types';
import React from 'react';

const getAnglePoint = (fraction, radius, rx, ry) => {
    var x, y;

    x = rx + radius * Math.cos(2*Math.PI * fraction);
    y = ry + radius * Math.sin(2*Math.PI * fraction);

    return { x, y };
};

class Piece extends React.Component {

    static propTypes = {
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

    constructor(props) {
        super(props);
        this.state = {
            textPoint: {
                x: 0,
                y: 0
            },
            path: '',
            part: 0,
            timeId: null,
        };
    }

    componentDidMount() {
        this.animate();
    }

    componentDidUpdate(prevProps) {
        const { fraction, start } = this.props;
        if (fraction != prevProps.fraction || start != prevProps.start) {
            this.handleStopTimeOut();
            this.animate();
        }
    }


    componentWillUnmount() {
        this.handleStopTimeOut();
    }

    animate = () => {
        this.draw(0);
    };

    draw = (s) => {
        const {fraction, hole, offset, radius, showLabel, start, trueHole} = this.props;

        let startA = getAnglePoint(start, radius, radius+offset.x, radius+offset.y);
        let startB = getAnglePoint(start, radius - hole, radius+offset.x, radius+offset.y);
        let step = fraction / 20;
        if (s + step > fraction) {
            s = fraction;
        }

        // Get angle points
        let endA = getAnglePoint(start + s, radius, radius+offset.x, radius+offset.y);
        let endB = getAnglePoint(start + s, radius - hole, radius+offset.x, radius+offset.y);

        let p = `M ${startA.x} ${startA.y} A ${radius} ${radius} 0 ${(s > 0.5 ? 1 : 0)} 1 ${endA.x} ${endA.y} L ${endB.x} ${endB.y} A ${radius- hole} ${radius- hole} 0 ${(s > 0.5 ? 1 : 0)} 0 ${startB.x} ${startB.y} Z`;

        if (s < fraction) {
            let timeoutId = setTimeout(() => { this.draw(s + step); } , 10);
            this.setState({timeId: timeoutId});
        } else if (showLabel) {
            let c = getAnglePoint(start + (fraction / 2), (radius / 2 + trueHole / 2), radius+offset.x, radius+offset.y);
            this.setState({textPoint: {x: c.x, y: c.y}});
        }
        this.setState({
            path: p,
            part: s
        });
    };

    handleStopTimeOut = () => {
        const {timeId} = this.state;
        clearTimeout(timeId);
    };

    render() {
        const {fill, fraction, hole, offset, radius, showLabel, showPercent, stroke, strokeWidth, value} = this.props;
        const {textPoint, path, part} = this.state;

        return (
            <g overflow="hidden">
                {fraction == 1 && part == 1 ? (
                    <React.Fragment>
                        <circle
                            cx={radius+offset.x}
                            cy={radius+offset.y}
                            r={radius}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={strokeWidth ? strokeWidth : 4}
                        />
                        <circle
                            cx={radius+offset.x}
                            cy={radius+offset.y}
                            r={hole/2-(strokeWidth ? strokeWidth : 4)/2}
                            fill={stroke}
                        />
                    </React.Fragment>
                ) : (
                    <path
                        d={path}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={strokeWidth ? strokeWidth : 4}
                    />
                )}
                {showLabel && fraction > 0.05 ? (
                    <text x={textPoint.x} y={textPoint.y} fill="#fff" textAnchor="middle" style={{fontSize:'12px', fontFamily:'monospace'}} >
                        {showPercent ? (fraction*100).toFixed(1) + '%' : value}
                    </text>
                ) : null}
            </g>
        );
    }
}

export default Piece;
