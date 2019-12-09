import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../../Stores';


const CountersReset = ({node}) => {

    const handleClickOk = () => {
        NodesActions.resetCounters(node.node_id);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" color="primary" onClick={handleClickOk}>
                {'Reset counters'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;