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
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

// const privileges = {
//     'NO_ACCESS': 0,
//     'READ': 1,
//     'READ|MODIFY': 2,
//     'READ|MODIFY|WATCH': 4,
//     'FULL': 8,
// }

class Revoke extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    handleClickOk = () => {
        const {user, target, privileges} = this.props;
        ApplicationActions.revoke(target, user.name, privileges);
        this.setState({show: false});
    }

    handleClickOpen = () => {
        this.setState({show: true});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    render() {
        const {show} = this.state;

        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.handleClickOk}>
                    {'Revoke'}
                </Button>
                <Dialog
                    open={show}
                    onClose={() => null}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'Revoke user'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickClose} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={this.handleClickOk} color="primary">
                            {'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

Revoke.propTypes = {
    // classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    user: PropTypes.object.isRequired,
    target: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    privileges: PropTypes.string.isRequired,

};

export default withStores(withStyles(styles)(Revoke));