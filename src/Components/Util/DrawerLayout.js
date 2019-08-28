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


const drawerWidth = 600;
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    full: {
        minWidth: 1200,
        width: '100%',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    shrink: {
        minWidth: 1200,
        width: `calc(100% - ${drawerWidth}px)`,
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
        width: drawerWidth,
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        minHeight: '100vh',
    },
    drawerClose: {
        width: '0%',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));


const DrawerLayout = ({open, onClose, topbar, mainContent, drawerTitle, drawerContent}) => {
    const classes = useStyles();

    return(
        <React.Fragment>
            <div className={classes.root}>
                <div className={clsx(classes.full, {
                    [classes.shrink]: open,
                })}
                >
                    {topbar}
                    {mainContent}
                </div>
                <Card className={clsx(classes.drawerClose, {
                    [classes.drawerOpen]: open,
                })}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={onClose}>
                            {open ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                        </IconButton>
                        <Typography variant="h6">
                            {drawerTitle}
                        </Typography>
                    </div>
                    <Divider />
                    {drawerContent}

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