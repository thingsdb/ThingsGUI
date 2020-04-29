import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import LandingContent from './LandingContent';
import {TopBar} from '../Navigation';


const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 35,
    },
    card: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
}));

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const LandingPage = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return(
        <div>
            <Button variant="text" color="primary" onClick={handleClickOpen}>
                <img
                    alt="ThingsDB Logo"
                    src="/img/thingsdb-logo.png"
                    className={classes.avatar}
                    draggable='false'
                />
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <LandingContent />
                <div style={{position:'fixed', width: "100%", bottom: -8, zIndex: 2}}>
                    <TopBar
                        pageIcon={
                            <IconButton edge="start" color="default" onClick={handleClose} aria-label="close">
                                <ExpandLessIcon />
                            </IconButton>
                            }
                        />
                </div>
            </Dialog>

        </div>
    );
};

export default LandingPage;