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

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class Shutdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    handleClickOk = () => {
        const {node} = this.props;
        ApplicationActions.shutdown(node);
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
                    {'Shutdown'}
                </Button>
                <Dialog
                    open={show}
                    onClose={this.handleClickClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'Remove user'}
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

Shutdown.propTypes = {
    // classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    node: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(Shutdown));