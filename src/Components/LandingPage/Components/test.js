import React from 'react';

var colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
const Test = ({data}) => {

    const d = data.reduce((res, item) => { res.push(item.number)  ; return res;}, []);

    return (
        <div>
            <Pie
                colors={ colors }
                data={ d }
                hole={ 50 }
                labels={ true }
                percent={ true }
                radius={ 150 }
                stroke={ '#fff' }
                strokeWidth={ 3 }
            />
        </div>
    );

};

function getAnglePoint(startAngle, endAngle, radius, x, y) {
	var x1, y1, x2, y2;

	x1 = x + radius * Math.cos(Math.PI * startAngle / 180);
	y1 = y + radius * Math.sin(Math.PI * startAngle / 180);
	x2 = x + radius * Math.cos(Math.PI * endAngle / 180);
	y2 = y + radius * Math.sin(Math.PI * endAngle / 180);

	return { x1, y1, x2, y2 };
};


const Pie = ({colors, data, hole, labels, percent, radius, stroke, strokeWidth}) => {

    let diameter = radius * 2;
    let colorsLength = colors.length;

    let sum = data.reduce(function (carry, current) { return carry + current }, 0);
    let startAngle = 0;


    return (
        <svg width={ diameter } height={ diameter } viewBox={ '0 0 ' + diameter + ' ' + diameter } xmlns="http://www.w3.org/2000/svg" version="1.1">
            { data.map(function (slice, sliceIndex) {
                var angle, nextAngle, per;

                nextAngle = startAngle;
                angle = (slice / sum) * 360;
                per = (slice / sum) * 100;
                startAngle += angle;

                return <Slice
                    key={ sliceIndex }
                    value={ slice }
                    percent={ percent }
                    percentValue={ per.toFixed(1) }
                    startAngle={ nextAngle }
                    angle={ angle }
                    radius={ radius }
                    hole={ radius - hole }
                    trueHole={ hole }
                    showLabel= { labels }
                    fill={ colors[sliceIndex % colorsLength] }
                    stroke={ stroke }
                    strokeWidth={ strokeWidth }
                />
            }) }

        </svg>
    );

};

const Slice = ({value, percent, percentValue, startAngle, angle, radius, hole, trueHole, showLabel, fill, stroke, strokeWidth}) => {
    const [textPoint, setTextPoint] = React.useState({
        x: 0,
        y: 0
    });
    const [path, setPath] = React.useState('');

	React.useEffect(() => {
        animate();
    }, []);

	const animate = () => {
		draw(0);
    }

	const draw = (s) => {

		let step = angle / (37.5 / 2);

		if (s + step > angle) {
			s = angle;
		}

		// Get angle points
		let a = getAnglePoint(startAngle, startAngle + s, radius, radius, radius);
        let b = getAnglePoint(startAngle, startAngle + s, radius - hole, radius, radius);

        let p = `M ${a.x1}, ${a.y1} A ${radius}, ${radius} 0 ${(s > 180 ? 1 : 0)} , 1 ${a.x2} , ${a.y2} L ${b.x2}, ${b.y2} A ${radius- hole}, ${radius- hole} 0 ${(s > 180 ? 1 : 0)} ,0 ${b.x1}, ${b.y1} Z`;

		setPath(p);

		if (s < angle) {
			setTimeout(() => { draw(s + step) } , 16);
		} else if (showLabel) {
			let c = getAnglePoint(startAngle, startAngle + (angle / 2), (radius / 2 + trueHole / 2), radius, radius);
			setTextPoint({x: c.x2, y: c.y2});
		}
    };


    return (
        <g overflow="hidden">
            <path
                d={ path }
                fill={ fill }
                stroke={ stroke }
                strokeWidth={ strokeWidth ? strokeWidth : 3 }
                    />
            { showLabel && percentValue > 5 ?
                <text x={ textPoint.x } y={ textPoint.y } fill="#fff" textAnchor="middle">
                    { percent ? percentValue + '%' : value }
                </text>
            : null }
        </g>
    );

}

export default Test;