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

const RemoveThing = ({collection, thing, info}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;


    console.log(info);

    const buildQuery = (p, ti, n, i) => {
        return i == null ? `t(${ti}).del('${n}')` 
            : n == '$' ? `t(${ti}).${p}.remove(t(${ti}).${p}.find(|s| (s.id()==${thing['#']}) ))`
            : `t(${ti}).${n}.splice(${i}, 1)`;
    };


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
        const queryString = buildQuery(
            info.hasOwnProperty('parentName') ? info.parentName : null, 
            info.id, 
            info.name, 
            info.hasOwnProperty('index') ? info.index : null
        );
        console.log(queryString);
        CollectionActions.rawQuery(
            collection.collection_id,
            info.id, 
            queryString, 
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
                        {serverError || 'Are you sure?'}
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

RemoveThing.propTypes = {
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
    info: PropTypes.object.isRequired, 
};

export default RemoveThing;
