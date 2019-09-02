import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {NodesActions} from '../../Stores/NodesStore';


const CountersReset = ({node, onServerError}) => {

    const handleClickOk = () => {
        NodesActions.resetCounters(node, (err) => onServerError(err));
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOk}>
                {'Reset counters'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
    onServerError: PropTypes.func.isRequired,
};

export default CountersReset;