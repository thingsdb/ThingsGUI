import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PeopleIcon from '@material-ui/icons/People';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import StorageIcon from '@material-ui/icons/Storage';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import PieChart from './Components';
import {TopBar} from '../Navigation';
import {NodesActions, NodesStore, ThingsdbActions, ThingsdbStore} from '../../Stores';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'users']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 35,
    },
    appBar: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: theme.spacing(1),
    },
    card: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    toolbar: {
        minHeight: 48,
    },
    root: {
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    divider: {
        border: '1px solid #89afe0',
    },
    icon: {
        fontSize: '70px',
        color: theme.palette.primary.main,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const LandingPage = ({collections, users, nodes}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [thingsSavedPerCol, setThingsSavedPerCol] = React.useState([]);

    React.useEffect(() => {
        NodesActions.getNodes();
    }, []);
    React.useEffect(() => {
        if(open) {
            console.log('hi')
            const t = collections.reduce((res, item) => { res.push({title: item.name, number: item.things}) ; return res;}, []);
            setThingsSavedPerCol(t);
        }
    }, [open, collections]);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const totalNumThings = thingsSavedPerCol.reduce((res, item) => { res += item.number  ; return res;}, 0);
    const totalNumCollections = collections.length;
    const totalNumUsers = users.length;
    const totalNumNodes = nodes.length

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
                <List>
                    <ListItem>
                        <Grid container>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Divider className={classes.divider} />
                                     <CardHeader
                                        action={
                                            <img
                                                alt="ThingsDB Logo"
                                                src="/img/thingsdb-logo.png"
                                                draggable='false'
                                                height="70px"
                                            />
                                        }
                                        title={totalNumThings}
                                        subheader="Total number of Things"
                                        subheaderTypographyProps={{
                                            variant:"button"
                                        }}
                                        titleTypographyProps={{
                                            variant:"h4"
                                        }}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Divider className={classes.divider} />
                                     <CardHeader
                                        action={
                                            <DashboardIcon className={classes.icon} />
                                        }
                                        title={totalNumCollections}
                                        subheader="Total number of Collections"
                                        subheaderTypographyProps={{
                                            variant:"button"
                                        }}
                                        titleTypographyProps={{
                                            variant:"h4"
                                        }}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Divider className={classes.divider} />
                                     <CardHeader
                                        action={
                                            <PeopleIcon className={classes.icon} />
                                        }
                                        title={totalNumUsers}
                                        subheader="Total number of Users"
                                        subheaderTypographyProps={{
                                            variant:"button"
                                        }}
                                        titleTypographyProps={{
                                            variant:"h4"
                                        }}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Divider className={classes.divider} />
                                     <CardHeader
                                        action={
                                            <StorageIcon className={classes.icon} />
                                        }
                                        title={totalNumNodes}
                                        subheader="Total number of Nodes"
                                        subheaderTypographyProps={{
                                            variant:"button"
                                        }}
                                        titleTypographyProps={{
                                            variant:"h4"
                                        }}
                                    />
                                </Card>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <Card className={classes.card}>
                                    <Grid container justify='center'>
                                        <PieChart data={thingsSavedPerCol} height={375+thingsSavedPerCol.length/2*25} width={300} radius={145} backgroundColor="#2E3336" title="Things per Collection" />
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card className={classes.card}>
                                    <Grid container justify='center'>
                                        <PieChart data={thingsSavedPerCol} height={375+thingsSavedPerCol.length/2*25} width={300} radius={145} backgroundColor="#2E3336" title="Things per Collection" />
                                    </Grid>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card className={classes.card}>
                                    <Grid container justify='center'>
                                        <PieChart data={thingsSavedPerCol} height={375+thingsSavedPerCol.length/2*25} width={300} radius={145} backgroundColor="#2E3336" title="Things per Collection" />
                                    </Grid>
                                </Card>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
                <div style={{position:'fixed', width: "100%", bottom: 0, zIndex: 2}}>
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

LandingPage.propTypes = {

    /* ThingsDB properties */
    collections: ThingsdbStore.types.collections.isRequired,
    users: ThingsdbStore.types.users.isRequired,

    /* Node properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(LandingPage);