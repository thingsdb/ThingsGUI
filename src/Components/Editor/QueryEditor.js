/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {withVlow} from 'vlow';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { makeStyles} from '@material-ui/core/styles';



import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore} from '../../Stores/CollectionStore';
import Query from './Query';

// function PaperComponent(props) {
//     return (
//         <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
//             <Paper {...props} />
//         </Draggable>
//     );
// }


const withStores = withVlow([{
    store: CollectionStore,
}]);

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
        backgroundColor: theme.palette.secondary.main,
        // height: 48,
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const QueryEditor = ({show}) => {
    const classes = useStyles();
    const handleClose = () => {
        ApplicationActions.closeEditor();
    };

    return (
        <Dialog
            open={show}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullScreen
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="default" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" color="textPrimary" className={classes.title}>
                        {'Query Editor'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Query />
            </DialogContent>
        </Dialog>
    );
};

QueryEditor.propTypes = {
    show: PropTypes.bool.isRequired,
};

export default withStores(QueryEditor);