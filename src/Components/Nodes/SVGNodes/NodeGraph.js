import PropTypes from 'prop-types';
import React from 'react';

import Arrow from './Components/Arrow';
import Node from './Components/Node';

const NodeGraph = ({width, height, radius, data, streamInfo}) => {

    const x = (a) => (width/2)+Math.cos(a*Math.PI)*radius;
    const y = (a) => (height/2)+Math.sin(a*Math.PI)*radius;
    const d = data.reduce((res, item, i) => { res[item.node_id] = [x(i*2/data.length),y(i*2/data.length)] ; return res;}, {});

    return(
        <svg width={width} height={height}>
            <defs>
                <filter id="blurFilter" >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                </filter>
            </defs>
            <ellipse cx={width/2} cy={height/2} rx={width/2} ry={height/2} fill="rgba(0, 0, 0, 0.3)" filter="url(#blurFilter)" />
            {data.filter(n=> streamInfo[n.node_id] !== undefined).map( n=> streamInfo[n.node_id].map( s => <Arrow key={s} startPointX={d[s][0]} startPointY={d[s][1]} endPointX={d[n.node_id][0]} endPointY={d[n.node_id][1]} />))}
            {data.map((n, i) => <Node key={i} x={d[n.node_id][0]} y={d[n.node_id][1]} data={n} color={n.status=='OFFLINE'? '#1b1c1d': n.status=='SHUTTING_DOWN' ? '#1b1c1d' : 'rgba(0, 55, 123, 0.5)'} />)}
        </svg>
    );
};


NodeGraph.defaultProps = {
    width: 900,
    height: 600,
    radius: 250,
    streamInfo: {},
};

NodeGraph.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    streamInfo:PropTypes.object,
};


export default NodeGraph;

