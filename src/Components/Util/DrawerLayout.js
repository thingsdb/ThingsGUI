import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Drawer from '@material-ui/core/Drawer';
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
        flexGrow: 1,
        overflowY: 'auto',
        height: 'calc(100% - 121px)', // footerHeight (60) + footerMarginTop (5) + topBarHeight (48) + appBarMarginBottom (8) = 121
    },
    footer: {
        position:'fixed',
        left: 0,
        bottom: 5,
        zIndex: 2
    },
    full: {
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        position: 'fixed',
        zIndex: 1,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    shrink: {
        position: 'fixed',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerOpen: {
        display: 'flex',
        flex: '1 0 auto',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '120px',
        position: 'fixed',
        right: 0,
        zIndex: 1200,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        marginRight: '0px',
        width: 0,
        height: '100%',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    dragger: {
        alignItems: 'center',
        bottom: 0,
        cursor: 'ew-resize',
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 5,
        zIndex: 3,

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
        width: drawerWidth,
        flexShrink: 0,

    },
    menuDrawerPaper: {
        overflowY: 'auto',
        borderColor: theme.palette.background.paper,
        width: drawerWidth,
        top: 'unset',
        paddingBottom: '120px'
    },
    menuDrawerClose: {
        width: 0,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));



const DrawerLayout = ({open, onClose, topbar, mainContent, menuOpen, menus, toast, bottomBar, drawerTitle, drawerContent}) => {
    const classes = useStyles();
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
            {topbar}
            <div className={classes.flex}>
                <Drawer
                    className={clsx(classes.menuDrawerClose, {
                        [classes.menuDrawer]: menuOpen,
                    })}
                    variant="persistent"
                    anchor="left"
                    open={menuOpen}
                    PaperProps={{
                        square: false
                    }}
                    classes={{
                        paper: classes.menuDrawerPaper,
                    }}
                >
                    <div className={classes.drawerContainer}>
                        <List>
                            {menus.map((item, index) => (
                                <ListItem key={`menu_item_${index}`}>
                                    {item}
                                </ListItem>
                            ))}
                        </List>
                        <div className={classes.footer}>
                            {bottomBar}
                        </div>
                    </div>
                </Drawer>
                <main
                    className={clsx(classes.full, {
                        [classes.shrink]: open || menuOpen,
                    })}
                    style={{
                        width: open && menuOpen ? `calc(100% - ${newWidth + drawerWidth}px)`
                            : open ? `calc(100% - ${newWidth}px)`
                                : menuOpen ? `calc(100% - ${drawerWidth}px)`
                                    : '100%',
                        marginLeft: menuOpen ? drawerWidth : null,
                        transition: isResizing ? 'none' : null

                    }}
                >
                    <div className={classes.body}>
                        {mainContent}
                    </div>
                </main>
                <Card
                    className={clsx(classes.drawerClose, {
                        [classes.drawerOpen]: open,
                    })}
                    style={open ? {width: newWidth } : null}
                >
                    <div
                        onMouseDown={handleMousedown}
                        className={open ? classes.dragger : classes.draggerClose}
                    >
                        <DragHandleIcon className={classes.draggerIcon} />
                    </div>
                    <div className={open ? classes.open : classes.close}>
                        <div className={classes.drawerHeader}>
                            <Button color="primary" onClick={onClose}>
                                {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                            </Button>
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