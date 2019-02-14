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

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['match', 'collections'],
});

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const privileges = [
    'READ',
    'MODIFY',
    'WATCH',
    'GRANT',
    'FULL',
];

class Grant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            errors: {},
            form: {},
        };
    }

    validation = {
        collection: (o) => o.collection.length>0,
    }
    
    handleOnChange = (e) => {
        const {form, errors} = this.state;
        form[e.target.id] = e.target.value;
        errors[e.target.id] = !this.validation[e.target.id](form, this.props);
        this.setState({form, errors});
    };

    handleClickOk = () => {
        const {user} = this.props;
        const {form} = this.state;
        const errors = Object.keys(this.validation).reduce((d, ky) => { d[ky] = !this.validation[ky](form, this.props);  return d; }, {});
        this.setState({errors});
        if (!Object.values(errors).some(d => d)) {
            ApplicationActions.grant(form.collection, user.name, form.privilege);
            this.setState({show: false});
        }
    }

    handleClickOpen = () => {
        const form = {
            collection: '',
            privilege: 'READ',
        };
        this.setState({show: true, errors: {}, form});
    }

    handleClickClose = () => {
        this.setState({show: false});
    }

    render() {
        const {collections} = this.props;
        const {show, errors, form} = this.state;

        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.handleClickOpen}>
                    {'Grant'}
                </Button>
                <Dialog
                    open={show}
                    onClose={this.handleClickClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'Grant user privileges'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="collection"
                            label="Collection"
                            value={form.collection}
                            onChange={this.handleOnChange}
                            fullWidth
                            error={errors.collection}
                            helperText={errors.collection?'Select a collection':null}
                            select
                            SelectProps={{native: true}}
                        >
                            <option value="" disabled="disabled" />
                            {collections.map(c => (
                                <option key={c.collection_id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            margin="dense"
                            id="privilege"
                            label="Privilege"
                            value={form.privilege}
                            onChange={this.handleOnChange}
                            fullWidth
                            select
                            SelectProps={{native: true}}
                        >
                            {privileges.map(p => (
                                <option key={p} value={p}>
                                    {p.toLowerCase()}
                                </option>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickClose} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={this.handleClickOk} color="primary" disabled={Object.values(errors).some(d => d)}>
                            {'Ok'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

Grant.propTypes = {
    collections: ApplicationStore.types.collections.isRequired,
    user: PropTypes.object.isRequired,
};

export default withStores(withStyles(styles)(Grant));