import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import {NodesActions} from '../../../Stores';


const CountersReset = ({nodeId}: Props) => {

    const handleClickOk = () => {
        NodesActions.resetCounters(nodeId);
    };

    return (
        <Button variant="outlined" color="primary" onClick={handleClickOk}>
            {'Reset counters'}
        </Button>
    );
};

CountersReset.propTypes = {
    nodeId: PropTypes.number.isRequired,
};

export default CountersReset;

interface Props {
    nodeId: number;
}