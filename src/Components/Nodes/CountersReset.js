import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {useNodes, NodesActions} from '../../Stores/NodesStore';


const CountersReset = ({node}) => {
    const [store, dispatch] = useNodes(); // eslint-disable-line no-unused-vars
    const resetCounters = React.useCallback(NodesActions.resetCounters(dispatch, node));

    const handleClickOk = () => {
        resetCounters();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Reset counters'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default CountersReset;