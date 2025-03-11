import { styled } from '@mui/material/styles';
import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from '@mui/icons-material/People';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import Typography from '@mui/material/Typography';

import PieChart from './Utils';
import { NodesActions, NodesStore, ThingsdbActions, ThingsdbStore } from '../../Stores';
import { StickyHeadTable } from '../Utils';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections', 'users']
}, {
    store: NodesStore,
    keys: ['allNodeInfo', 'nodes']
}]);

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0.5),
    margin: theme.spacing(0.5),
}));

const DashboardContent = ({allNodeInfo, collections, users, nodes}) => {
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
            logo: <LibraryBooksIcon color="primary" sx={{ fontSize: '70px' }} />
        }, {
            title: 'Total number of Users',
            data: users.length,
            logo: <PeopleIcon color="primary" sx={{ fontSize: '70px' }} />
        }, {
            title: 'Total number of Nodes',
            data: nodes.length,
            logo: <StorageIcon color="primary" sx={{ fontSize: '70px' }} />
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
        <Grid container sx={{marginBottom: '48px'}} alignItems="center" >
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={11}>
                                    <Typography variant="body1" >
                                        {'Dashboard of'}
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
                    </StyledCard>
                </Grid>
                {numbers.map((n, i)=> (
                    <Grid key={i} item xs={6} sm={3}>
                        <StyledCard>
                            <Divider sx={{border: '1px solid #89afe0'}} />
                            <CardHeader
                                action={n.logo}
                                title={n.data}
                                subheader={n.title}
                                slotProps={{
                                    subheader: {
                                        variant:'button'
                                    },
                                    title: {
                                        variant:'h4'
                                    }
                                }}
                            />
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            <Grid container item xs={12}>
                {piecharts.map((p,i)=>(
                    <Grid key={i} item sm={12} md={4}>
                        <StyledCard>
                            <Grid container justifyContent="center">
                                {p.data&&p.data.length ? (
                                    <PieChart data={p.data} radius={radius} stroke="#2E3336" showPercent title={p.title} />
                                ) : (
                                    <Typography variant="body1" >
                                        {'No data...'}
                                    </Typography>
                                )}
                            </Grid>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            <Grid container item xs={12}>
                {tables.map((p,i)=>(
                    <Grid key={i} item sm={12} md={4}>
                        <StyledCard>
                            <Grid container justifyContent="center">
                                <StickyHeadTable columns={p.columns} rows={p.rows} size="small" />
                            </Grid>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

DashboardContent.propTypes = {

    /* ThingsDB properties */
    collections: ThingsdbStore.types.collections.isRequired,
    users: ThingsdbStore.types.users.isRequired,

    /* Node properties */
    allNodeInfo: NodesStore.types.allNodeInfo.isRequired,
    nodes: NodesStore.types.nodes.isRequired,
};

export default withStores(DashboardContent);