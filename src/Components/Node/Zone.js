import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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

const zones = [
    0,
    1,
    //TODOK
];

class Zone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            form: {},
        };
    }

    handleOnChange = (e) => {
        const {form} = this.state;
        form[e.target.id] = e.target.value;
        this.setState({form});
    };

    handleClickOk = () => {
        const {node} = this.props;
        const {form} = this.state;
        ApplicationActions.zone(node, form.zone);
        this.setState({show: false});
    }

    handleClickOpen = () => {
        const {node} = this.props;
        const form = {level: node.zone};
        this.setState({show: true, form});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    render() {
        const {show, form} = this.state;

        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.handleClickOpen}>
                    {'Zone'}
                </Button>
                <Dialog
                    open={show}
                    onClose={this.handleClickClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'Set zone'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="zone"
                            label="Zone"
                            value={form.zone}
                            onChange={this.handleOnChange}
                            fullWidth
                            select
                            SelectProps={{native: true}}
                        >
                            {zones.map(p => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </TextField>
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

Zone.propTypes = {
    // classes: PropTypes.object.isRequired,
    // connErr: ApplicationStore.types.connErr.isRequired,
    // match: ApplicationStore.types.match.isRequired,
    node: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(Zone));