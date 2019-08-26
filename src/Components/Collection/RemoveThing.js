import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';

const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    warning: {
        color: amber[700],
    },
}));

const initialState = {
    show: false,
    serverError: '',
};

const RemoveThing = ({collection, thing, info}) => {
    const classes = useStyles();
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

        ThingsdbActions.getCollections((err) => setState({...state, serverError: err.log}));

        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }

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
                    <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Grid item><Avatar className={classes.avatar}><WarningIcon className={classes.warning}/></Avatar></Grid>
                                <Grid item>{serverError}</Grid>
                                <Grid item> 
                                    <IconButton aria-label="settings" onClick={handleCloseError}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Collapse>
                    <DialogContentText>
                        {'Are you sure?'}
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
