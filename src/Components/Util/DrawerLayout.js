import {makeStyles, useTheme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

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
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    shrink: {
        position: 'relative',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
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
        display: 'flex',
        width: 5,
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',

    },
    draggerClose: {
        width: 0,
    },
    draggerIcon: {
        transform: 'rotate(90deg)'
    },
    open: {
        display: 'block',
    },
    close: {
        display: 'none'
    },
    menuDrawer: {
        position: 'relative',
        width: drawerWidth,
        flexShrink: 0,
    },
    menuDrawerPaper: {
        boxShadow: '2px 0 5px 0 rgba(31,30,30,1)',
        borderColor: theme.palette.background.paper,
        width: drawerWidth,
    },
    menuDrawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    menuDrawerClose: {
        position: 'relative',
        width: 0,
    },
}));



const DrawerLayout = ({open, onClose, topbar, mainContent, menuOpen, onMenuClose, menus, toast, bottomBar, drawerTitle, drawerContent}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [isResizing, setIsResizing] = React.useState(false);
    const [newWidth, setNewWidth] = React.useState(650);


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
                <Drawer
                    className={clsx(classes.menuDrawerClose, {
                        [classes.menuDrawer]: menuOpen,
                    })}
                    variant="persistent"
                    anchor="left"
                    open={menuOpen}
                    classes={{
                        paper: classes.menuDrawerPaper,
                    }}
                >
                    <div className={classes.menuDrawerHeader}>
                        <IconButton onClick={onMenuClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon color="primary" /> : <ChevronRightIcon color="primary" />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {menus.map((item, index) => (
                            <ListItem key={`menu_item_${index}`}>
                                {item}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <div
                    className={clsx(classes.full, {
                        [classes.shrink]: open || menuOpen,
                    })}
                    style={open && menuOpen ? {width: `calc(100% - ${newWidth + drawerWidth}px)`, marginLeft: drawerWidth}
                        : open ? {width: `calc(100% - ${newWidth}px)`}
                            : menuOpen ? {width: `calc(100% - ${drawerWidth}px)`, marginLeft: drawerWidth}
                                : {width:'100%'}}
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
                    >
                        <DragHandleIcon className={classes.draggerIcon} />
                    </div>
                    <div className={open ? classes.open : classes.close}>
                        <div className={classes.drawerHeader}>
                            <IconButton color="primary" onClick={onClose}>
                                {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                            </IconButton>
                            <Typography variant="body2">
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

DrawerLayout.defaultProps = {
    mainContent: null,
};

DrawerLayout.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMenuClose: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    menus: PropTypes.arrayOf(PropTypes.object).isRequired,
    topbar: PropTypes.object.isRequired,
    mainContent: PropTypes.object,
    toast: PropTypes.object.isRequired,
    bottomBar: PropTypes.object.isRequired,
    drawerTitle: PropTypes.string.isRequired,
    drawerContent: PropTypes.object.isRequired,
};

export default DrawerLayout;