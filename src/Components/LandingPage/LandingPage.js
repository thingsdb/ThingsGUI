import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {withVlow} from 'vlow';

import PieChart from './Components';
import {ThingsdbActions, ThingsdbStore} from '../../Stores';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 35,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: theme.spacing(1),
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    toolbar: {
        minHeight: 48,
    },
}));

const LandingPage = ({collections}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [thingsSavedPerCol, setThingsSavedPerCol] = React.useState([]);

    React.useEffect(() => {
        ThingsdbActions.getCollections();
    }, []);
    React.useEffect(() => {
        if(open) {
            const t = collections.reduce((res, item) => { res.push({title: item.name, number: item.things}) ; return res;}, []);
            setThingsSavedPerCol(t);
        }
    }, [open]);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    console.log(thingsSavedPerCol, collections);

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
            {open && (
                <Dialog fullScreen open={open} onClose={handleClose}>
                    <AppBar className={classes.appBar} position="static">
                        <Toolbar className={classes.toolbar}>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <List>
                    <ListItem>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <PieChart data={thingsSavedPerCol} backgroundColor="#1e2224" title="Things per Collection" />
                    </ListItem>
                    </List>
                </Dialog>
            )}
        </div>
    );
};

export default withStores(LandingPage);