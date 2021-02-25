import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import StorageIcon from '@material-ui/icons/Storage';
import Typography from '@material-ui/core/Typography';

import PieChart from './Components';
import {NodesActions, NodesStore, ThingsdbActions, ThingsdbStore} from '../../Stores';
import {StickyHeadTable} from '../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'users']
}, {
    store: NodesStore,
    keys: ['allNodeInfo', 'nodes']
}]);

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(0.5),
        margin: theme.spacing(0.5),
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
    grid: {
        marginBottom: theme.spacing(2),
    },
}));


const LandingContent = ({allNodeInfo, collections, users, nodes}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getNodes(()=>NodesActions.getDashboardInfo());
        ThingsdbActions.getCollections();
        ThingsdbActions.getUsers();
    };

    React.useEffect(() => {
        handleRefresh();
    }, []);

    const thingsSavedPerCol = collections.reduce((res, item) => { res.push({title: item.name, number: item.things}); return res;}, []);
    const totalNumThings = thingsSavedPerCol.reduce((res, item) => { res += item.number  ; return res;}, 0);
    const {clientPerNode, queriesPerNode} = allNodeInfo.reduce((res, item) => { res.clientPerNode.push({title: `node:${item.node_info.node_id}`, number: item.node_info.connected_clients}); res.queriesPerNode.push({title: `node:${item.node_info.node_id}`, number: item.counters.queries_success})  ; return res;}, {clientPerNode:[], queriesPerNode: []});

    const numbers = [
        {
            title: 'Total number of Things',
            data: totalNumThings,
            logo:  <img alt='ThingsDB Logo' src='/img/thingsdb-logo.png' draggable='false' height='70px' />
        }, {
            title: 'Total number of Collections',
            data: collections.length,
            logo: <DashboardIcon className={classes.icon} />
        }, {
            title: 'Total number of Users',
            data: users.length,
            logo: <PeopleIcon className={classes.icon} />
        }, {
            title: 'Total number of Nodes',
            data: nodes.length,
            logo: <StorageIcon className={classes.icon} />
        }
    ];
    const piecharts = [
        {
            title: 'Things per Collection',
            data: thingsSavedPerCol
        }, {
            title: 'Clients connected per Node',
            data: clientPerNode
        }, {
            title: 'Queries per Node',
            data: queriesPerNode
        }
    ];


    const columns = (ltitle, lnumber) => ([
        { id: 'title', label: ltitle, minWidth: 170 },
        {
            id: 'number',
            label: lnumber,
            minWidth: 170,
            align: 'right',
            format: (value) => value.toFixed(0),
        },
    ]);

    const tables = [
        {
            columns: columns('Collections', 'Number of Things'),
            rows: thingsSavedPerCol
        }, {
            columns: columns('Node', 'Number of Clients'),
            rows: clientPerNode
        }, {
            columns: columns('Node', 'Number of Queries'),
            rows: queriesPerNode
        }];

    const radius = 160;

    return(
        <Grid container className={classes.grid} alignItems="center" >
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Card className={classes.card} raised>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={11}>
                                    <Typography variant="body1" >
                                        {'Overview of'}
                                    </Typography>
                                    <Typography variant="h4">
                                        {'ThingsDB'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button color="primary" onClick={handleRefresh} size="medium">
                                        <RefreshIcon color="primary" style={{ fontSize: 50 }}  />
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                {numbers.map((n, i)=> (
                    <Grid key={i} item xs={6} sm={3}>
                        <Card className={classes.card}>
                            <Divider className={classes.divider} />
                            <CardHeader
                                action={n.logo}
                                title={n.data}
                                subheader={n.title}
                                subheaderTypographyProps={{
                                    variant:'button'
                                }}
                                titleTypographyProps={{
                                    variant:'h4'
                                }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Grid container item xs={12}>
                {piecharts.map((p,i)=>(
                    <Grid key={i} item sm={12} md={4}>
                        <Card className={classes.card}>
                            <Grid container justify="center">
                                {p.data&&p.data.length ? (
                                    <PieChart data={p.data} radius={radius} stroke="#2E3336" showPercent title={p.title} />
                                ) : (
                                    <Typography variant="body1" >
                                        {'No data...'}
                                    </Typography>
                                )}
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Grid container item xs={12}>
                {tables.map((p,i)=>(
                    <Grid key={i} item sm={12} md={4}>
                        <Card className={classes.card}>
                            <Grid container justify="center">
                                <StickyHeadTable columns={p.columns} rows={p.rows} size="small" />
                            </Grid>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

LandingContent.propTypes = {

    /* ThingsDB properties */
    collections: ThingsdbStore.types.collections.isRequired,
    users: ThingsdbStore.types.users.isRequired,

    /* Node properties */
    allNodeInfo: NodesStore.types.allNodeInfo.isRequired,
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(LandingContent);