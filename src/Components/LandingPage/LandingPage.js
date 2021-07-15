/*eslint-disable react/jsx-props-no-spreading*/
/*eslint-disable react/no-multi-comp*/
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
// import {version} from '../../package.json';

import {historyDeleteQueryParam, historyGetQueryParam, historySetQueryParam} from '../Util';
import {TopBar} from '../Navigation';
import LandingContent from './LandingContent';

const version='version: 0.5.0';

const useStyles = makeStyles(theme => ({
    avatar: {
        height: 35,
    },
    color: {
        color: theme.palette.text.primary
    },
}));

const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="down" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const LandingPage = () => {
    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(() => {
        let landingParam = historyGetQueryParam(history, 'landing');
        if (landingParam) {
            return true;
        }
        return false;
    });

    React.useEffect(() => {
        if(history.location.pathname === '/'){
            handleOpen();
        }
    }, [handleOpen, history]);

    const handleOpen = React.useCallback(() => {
        historySetQueryParam(history, 'landing', true);
        setOpen(true);
    }, [history]);

    const handleClose = () => {
        historyDeleteQueryParam(history, 'landing');
        setOpen(false);
    };

    return(
        <div>
            <Button variant="text" color="primary" onClick={handleOpen}>
                <img
                    alt="ThingsDB Logo"
                    src="/img/thingsgui-logo.png"
                    className={classes.avatar}
                    draggable='false'
                />
            </Button>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <LandingContent />
                <div style={{position:'fixed', width: '100%', bottom: -8, zIndex: 2}}>
                    <TopBar
                        title={
                            <Typography variant="button" color="textPrimary">
                                {version}
                            </Typography>
                        }
                        pageIcon={
                            <IconButton edge="start" className={classes.color} onClick={handleClose} aria-label="close">
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