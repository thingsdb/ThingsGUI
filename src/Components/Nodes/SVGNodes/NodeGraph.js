import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {NodesStore} from '../../../Stores';
import Arrow from './Components/Arrow';
import Node from './Components/Node';


const withStores = withVlow([{
    store: NodesStore,
    keys: ['streamInfo']
}]);

const NodeGraph = ({width, height, radius, data, streamInfo}) => {

    const x = (a) => (width/2)+Math.cos(a*Math.PI)*radius;
    const y = (a) => (height/2)+Math.sin(a*Math.PI)*radius;
    const d = data.reduce((res, item, i) => { res[item.node_id] = [x(i*2/data.length),y(i*2/data.length)] ; return res;}, {});

    return(
        <svg width={width} height={height}>
            {data.map((n, i) => (
                <React.Fragment key={`l${i}`} >
                    {streamInfo[n.node_id]!=undefined&&streamInfo[n.node_id].map((s) => {
                        return(
                            <Arrow key={s} startPointX={d[s][0]} startPointY={d[s][1]} endPointX={d[n.node_id][0]} endPointY={d[n.node_id][1]} />
                        );
                    })}
                </React.Fragment>
            ))}
            {data.map((n, i) => (
                <Node key={`n${i}`} x={d[n.node_id][0]} y={d[n.node_id][1]} data={n} color={n.status=='OFFLINE'? 'red': n.status=='SHUTTING_DOWN' ? 'orange' : 'rgba(0, 55, 123, 0.5)'} />
            ))}
        </svg>
    );
};


NodeGraph.defaultProps = {
    width: 500,
    height: 500,
    radius: 150,
};

NodeGraph.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,

    /* nodes properties */
    streamInfo: NodesStore.types.streamInfo.isRequired,
};


export default withStores(NodeGraph);

// memory allocation error in `ti_query_parse` at ../src/ti/query.c:709
