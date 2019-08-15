import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import {CollectionActions} from '../../Stores/CollectionStore';

const initialState = {
    show: false,
    serverError: '',
};

const RemoveThing = ({collection, thingId, propertyName, type, index}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    console.log(propertyName, index);

    const handleClickOpen = () => {
        setState({
            show: true,
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        CollectionActions.removeThing(
            {
                collectionId: collection.collection_id,
                thingId: thingId, 
                propertyName: propertyName,
                type: type,
                index: index,
            }, 
            (err) => setState({...state, serverError: err.log})
        );

        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    return (
        <React.Fragment>
            <ButtonBase onClick={handleClickOpen} >
                <DeleteIcon color={'primary'}/>
            </ButtonBase>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle id="form-dialog-title">
                    {'Remove Thing'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant={'caption'} color={'error'}>
                            {serverError || 'Are you sure?'}
                        </Typography>  
                    </DialogContentText>
                </DialogContent> 
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Remove'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

RemoveThing.defaultProps = {
    index: null,
};

RemoveThing.propTypes = {
    collection: PropTypes.object.isRequired,
    thingId: PropTypes.number.isRequired,
    propertyName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.any,
};

export default RemoveThing;
