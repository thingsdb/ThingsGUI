import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../../Stores';


const CountersReset = ({nodeId}) => {

    const handleClickOk = () => {
        NodesActions.resetCounters(nodeId);
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
    nodeId: PropTypes.number.isRequired,
};

export default CountersReset;