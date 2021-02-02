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
    flex: {
        display: 'flex',
    },
    body: {
        overflowY: 'auto',
        height: 'calc(100% - 65px)',
    },
    footer: {
        boxShadow: '0 -2px 10px 0 rgba(31,30,30,1)',
        borderRadius: 20,
        marginTop: 5,
        height: 60,
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
        boxShadow: '-2px 0 5px 0 rgba(31,30,30,1)',
        position: 'relative',
        right: 0,
        zIndex: 2,
        overflowY: 'auto',
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
        width: 5,
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 3,
    },
    draggerClose: {
        width: 0,
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
    },[handleMousemove, handleMouseup, isResizing]);


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

    }, []);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, []);


    return(
        <div>
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