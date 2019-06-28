import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {NodesActions, useStore} from '../../Stores/NodesStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const CountersReset = ({node}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    const resetCounters = React.useCallback(NodesActions.shutdown(dispatch, node), [dispatch]);

    const handleClickOk = () => {
        resetCounters();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Shutdown'}
            </Button>
        </React.Fragment>
    );
};

CountersReset.propTypes = {
    node: PropTypes.object.isRequired,
};

export default withStyles(styles)(CountersReset);