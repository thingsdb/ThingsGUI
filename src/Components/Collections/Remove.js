import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles} from '@material-ui/core/styles';
import {useStore, AppActions} from '../../Stores/ApplicationStore';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const Remove = ({collection}) => {
    const [store, dispatch] = useStore(); // eslint-disable-line
    const [show, setShow] = React.useState(false);
    
    const remove = React.useCallback(AppActions.removeCollection(dispatch, collection.name));
    
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        remove();
        setShow(false);
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                {'Remove'}
            </Button>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {'Remove collection'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/* {connErr} */}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Remove.propTypes = {
    // classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    collection: PropTypes.object.isRequired,
};

export default withStyles(styles)(Remove);