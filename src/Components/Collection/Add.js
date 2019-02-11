import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withVlow} from 'vlow';

import {ApplicationStore, ApplicationActions} from '../../Stores/ApplicationStore.js';

const withStores = withVlow({
    store: ApplicationStore,
    keys: ['loaded', 'connected', 'connErr'],
});


class AddCollection extends React.Component {
    state = {
        name: '',
    };

    handleOnChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    render() {
        const {onAdd} = this.props;
        const {name} = this.state;

        return (
            <div>
                <Dialog
                    open={true}
                    onClose={() => null}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {'New collection'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {connErr} */}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            value={name}
                            spellCheck={false}
                            onChange={this.handleOnChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => onAdd(name)} color="primary">
                            {'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AddCollection.propTypes = {
    // connErr: ApplicationStore.types.connErr.isRequired,
    onAdd: PropTypes.func.isRequired,
};

export default withStores(AddCollection);