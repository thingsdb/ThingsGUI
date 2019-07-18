import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {useStore, AppActions} from '../../Stores/ApplicationStore';
import {useNodes, NodesActions} from '../../Stores/NodesStore';


const Shutdown = ({node}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    const [nodesStore, nodesDispatch] = useNodes(); // eslint-disable-line no-unused-vars

    const disconnect = React.useCallback(AppActions.disconnect(dispatch), [dispatch]);
    const shutdown = React.useCallback(NodesActions.shutdown(nodesDispatch, node), [dispatch]);

    const handleClickOk = () => {
        shutdown();
        disconnect();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Shutdown'}
            </Button>
        </React.Fragment>
    );
};

Shutdown.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Shutdown;