import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddToken from './AddToken';
import RemoveExpired from './RemoveExpired';
import Table from '../Util/Table';
import ServerError from '../Util/ServerError';


const Tokens = ({user}) => {
    const [show, setShow] = React.useState(false);
    const [serverError, setServerError] = React.useState('');

    const rows = user.tokens;
    const header = [{
        ky: 'description',
        label: 'Description',
    }, {
        ky: 'expiration_time',
        label: 'Expiration time',
    }, {
        ky: 'key',
        label: 'Key',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const handleRowClick = () => null;
   
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleServerError = (err) => {
        setServerError(err.log);
    }

    const handleCloseError = () => {
        setServerError('');
    }
    const openError = Boolean(serverError); 

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                {'Tokens'}
            </Button>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth={user.tokens.length ? "md" : "sm"}
            >
                <DialogTitle id="form-dialog-title">
                    {`Tokens ${user.name}`}
                </DialogTitle>
                <DialogContent>
                    {user.tokens.length ? (
                        <Table header={header} rows={rows} rowClick={handleRowClick} />
                    ) : (
                        <DialogContentText>
                            {'No tokens set.'}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <RemoveExpired onServerError={handleServerError} />
                    <AddToken user={user} />
                    <Button onClick={handleClickClose} color="primary">
                        {'Back'}
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Tokens.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Tokens;