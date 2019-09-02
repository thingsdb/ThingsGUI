import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import { NodesActions, useStore } from '../../Actions/NodesActions';



const CountersReset = ({node}) => {
    const dispatch = useStore()[1];
    const handleClickOk = () => {
        NodesActions.resetCounters(dispatch, node);
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
};

export default CountersReset;