import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const Revoke = ({user, target, privileges}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    
    const revoke = React.useCallback(AppActions.revoke(dispatch, user.name, target, privileges));
    
    const handleClickOk = () => {
        revoke();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Revoke'}
            </Button>
        </React.Fragment>
    );
};

Revoke.propTypes = {
    user: PropTypes.object.isRequired,
    target: PropTypes.string.isRequired,
    privileges: PropTypes.string.isRequired, // TODOK
};

export default withStyles(styles)(Revoke);