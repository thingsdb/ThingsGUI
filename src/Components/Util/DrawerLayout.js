import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '@global': {
            '*::-webkit-scrollbar': {
                width: '0.4em'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '*::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.primary.main,
                outline: '1px solid slategrey'
            }
        }
    },
    full: {
        width: '100%',
        position: 'relative',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    shrink: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    drawerOpen: {
        minWidth: 400,
        position: 'relative',
        right: 0,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        minHeight: '100vh',
        zIndex: 2,
    },
    drawerClose: {
        width: '0%',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    dragger: {
        width: '5px',
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: '100',
    },
    content: {
        margin: theme.spacing(1),
    },
}));



const DrawerLayout = ({open, onClose, topbar, mainContent, drawerTitle, drawerContent}) => {
    const classes = useStyles();
    const [isResizing, setIsResizing] = React.useState(false);
    const [newWidth, setNewWidth] = React.useState(600);


    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        } else {
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[isResizing]);


    const handleMousedown = () => {
        setIsResizing(true);
    };

    const handleMousemove = React.useCallback((event) => {
        console.log(document.body.offsetWidth, event.clientX, document.body.offsetLeft);
        let offsetRight =
            document.body.offsetWidth - (event.clientX - document.body.offsetLeft);

        let minWidth = 400;
        let maxWidth = 900;
        if (offsetRight > minWidth && offsetRight < maxWidth) {
            setNewWidth(offsetRight);
        }

    }, [setNewWidth]);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, [setIsResizing]);


    return(
        <React.Fragment>
            <div className={classes.root}>

                <div
                    className={clsx(classes.full, {
                        [classes.shrink]: open,
                    })}
                    style={open ? {width: `calc(100% - ${newWidth}px)`} : null}
                >
                    {topbar}
                    <div className={classes.content}>
                        {mainContent}
                    </div>
                </div>
                <Card
                    className={clsx(classes.drawerClose, {
                        [classes.drawerOpen]: open,
                    })}
                    style={open ? {width: newWidth, marginRight: -newWidth } : null}
                >
                    <div
                        id="dragger"
                        onMouseDown={handleMousedown}
                        className={classes.dragger}
                    />
                    <div>
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={onClose}>
                                {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                            </IconButton>
                            <Typography variant="body1">
                                {drawerTitle}
                            </Typography>
                        </div>
                        <Divider />
                        {drawerContent}
                    </div>
                </Card>
            </div>
        </React.Fragment>
    );
};

DrawerLayout.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    topbar: PropTypes.object.isRequired,
    mainContent: PropTypes.object.isRequired,
    drawerTitle: PropTypes.string.isRequired,
    drawerContent: PropTypes.object.isRequired,
};

export default DrawerLayout;