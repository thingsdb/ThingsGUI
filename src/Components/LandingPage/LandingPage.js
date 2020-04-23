import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
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
        height: 10,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

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

    const totalNumThings = thingsSavedPerCol.reduce((res, item) => { res += item.number  ; return res;}, 0);

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
                                    <Divider />
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
                                    <Typography variant="button">
                                        {'Total number of Things'}
                                    </Typography>
                                    <Typography variant="h4">
                                        {totalNumThings}
                                    </Typography>
                                    <Divider />
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Typography variant="button">
                                        {'Total number of Things'}
                                    </Typography>
                                    <Typography variant="h4">
                                        {totalNumThings}
                                    </Typography>
                                    <Divider />
                                </Card>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Card className={classes.card}>
                                    <Typography variant="button">
                                        {'Total number of Things'}
                                    </Typography>
                                    <Typography variant="h4">
                                        {totalNumThings}
                                    </Typography>
                                    <Divider />
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
                    <AppBar className={classes.appBar} position="static">
                        <Toolbar className={classes.toolbar}>
                            <IconButton edge="start" color="default" onClick={handleClose} aria-label="close">
                                <ExpandLessIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>
            </Dialog>

        </div>
    );
};

export default withStores(LandingPage);