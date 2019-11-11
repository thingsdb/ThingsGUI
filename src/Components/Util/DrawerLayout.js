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
        },
    },
    flex: {
        display: 'flex',
    },
    body: {
        overflowY: 'auto',
        height: 'calc(100% - 60px)',
        // boxShadow: '0 10px 20px 0 rgba(31,30,30,1)',

        // borderRadius: '20px',
    },
    footer: {
        // borderTop: '3px solid slategrey',
        boxShadow: '0 -10px 20px 0 rgba(31,30,30,1)',

        borderRadius: '20px',
        height: '60px',
    },
    full: {
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto',
        height: '100vh',
    },
    shrink: {
        position: 'relative',
    },
    drawerOpen: {
        position: 'relative',
        right: 0,
        zIndex: 2,
        height: '100vh',
    },
    drawerClose: {
        marginRight: '0px',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    dragger: {
        width: '5px',
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 3,
    },
    draggerClose: {
        width: '0px',
    },
    open: {
        display: 'block',
    },
    close: {
        display: 'none'
    },
}));



const DrawerLayout = ({open, onClose, topbar, mainContent, toast, bottomBar, drawerTitle, drawerContent}) => {
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
        let offsetRight =
            document.body.offsetWidth - (event.clientX - document.body.offsetLeft);

        let minWidth = 400;
        if (offsetRight > minWidth) {
            setNewWidth(offsetRight);
        }

    }, [setNewWidth]);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, [setIsResizing]);


    return(
        <div className={classes.root}>
            <div className={classes.flex}>
                <div
                    className={clsx(classes.full, {
                        [classes.shrink]: open,
                    })}
                    style={open ? {width: `calc(100% - ${newWidth}px)`} : {width:'100%'}}
                >
                    <div className={classes.body}>
                        {topbar}
                        {mainContent}
                    </div>
                    <div className={classes.footer}>
                        {bottomBar}
                    </div>
                </div>
                <Card
                    className={clsx(classes.drawerClose, {
                        [classes.drawerOpen]: open,
                    })}
                    style={open ? {width: newWidth } : {width: '0%'}}
                >
                    <div
                        onMouseDown={handleMousedown}
                        className={open ? classes.dragger : classes.draggerClose}
                    />
                    <div className={open ? classes.open : classes.close}>
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
                {toast}
            </div>
        </div>
    );
};

DrawerLayout.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    topbar: PropTypes.object.isRequired,
    mainContent: PropTypes.object.isRequired,
    toast: PropTypes.object.isRequired,
    bottomBar: PropTypes.object.isRequired,
    drawerTitle: PropTypes.string.isRequired,
    drawerContent: PropTypes.object.isRequired,
};

export default DrawerLayout;