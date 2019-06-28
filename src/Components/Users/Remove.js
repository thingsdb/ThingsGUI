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

const Remove = ({user}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line no-unused-vars
    
    const remove = React.useCallback(AppActions.removeUser(dispatch, user.name));
    
    const handleClickOk = () => {
        remove();
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOk}>
                {'Remove'}
            </Button>
        </React.Fragment>
    );
};

Remove.propTypes = {
    user: PropTypes.object.isRequired,
};

export default withStyles(styles)(Remove);