import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import StorageIcon from '@material-ui/icons/Storage';
import Typography from '@material-ui/core/Typography';

import PieChart from './Components';
import {NodesActions, NodesStore, ThingsdbStore} from '../../Stores';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'users']
}, {
    store: NodesStore,
    keys: ['nodes']
}]);

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    divider: {
        border: '1px solid #89afe0',
    },
    icon: {
        fontSize: '70px',
        color: theme.palette.primary.main,
    },
}));


const LandingContent = ({collections, users, nodes}) => {
    const classes = useStyles();
    const [allNodeInfo, setAllNodeInfo] = React.useState([]);

    React.useEffect(() => {
        NodesActions.getNodes(()=>NodesActions.getDashboardInfo(setAllNodeInfo));
    }, []);

    const thingsSavedPerCol = collections.reduce((res, item) => { res.push({title: item.name, number: item.things}) ; return res;}, []);
    const totalNumThings = thingsSavedPerCol.reduce((res, item) => { res += item.number  ; return res;}, 0);
    const totalNumCollections = collections.length;
    const totalNumUsers = users.length;
    const totalNumNodes = nodes.length
    const {clientPerNode, queriesPerNode} = allNodeInfo.reduce((res, item) => { res.clientPerNode.push({title: `node:${item.node_info.node_id}`, number: item.node_info.connected_clients}); res.queriesPerNode.push({title: `node:${item.node_info.node_id}`, number: item.counters.queries_success})  ; return res;}, {clientPerNode:[], queriesPerNode: []});


    const radius = 160;
    const tl = thingsSavedPerCol.length;
    const cl= clientPerNode.length;
    const ql= queriesPerNode.length;
    const length = tl>cl?tl>ql?tl:ql:cl>ql?cl:ql;
    return(
        <Grid container>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Card className={classes.card} raised>
                        <CardContent>
                            <Typography variant="body1" >
                                {'Overview of'}
                            </Typography>
                            <Typography variant="h4">
                                {'ThingsDB'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
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
            <Grid container item xs={12}>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <Grid container justify='center'>
                            <PieChart data={thingsSavedPerCol} height={2*radius+85+length/2*25} width={2*radius+10} radius={radius} backgroundColor="#2E3336" showPercent title="Things per Collection" />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <Grid container justify='center'>
                            <PieChart data={clientPerNode} height={2*radius+85+length/2*25} width={2*radius+10} radius={radius} backgroundColor="#2E3336" title="Clients connected per Node" />
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <Grid container justify='center'>
                            <PieChart data={queriesPerNode} height={2*radius+85+length/2*25} width={2*radius+10} radius={radius} backgroundColor="#2E3336" title="Queries per Node" />
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

LandingContent.propTypes = {

    /* ThingsDB properties */
    collections: ThingsdbStore.types.collections.isRequired,
    users: ThingsdbStore.types.users.isRequired,

    /* Node properties */
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(LandingContent);