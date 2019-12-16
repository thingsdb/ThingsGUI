import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import RemoveIcon from '@material-ui/icons/HighlightOff';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {EventActions, EventStore, ThingsdbStore} from '../../Stores';
import {ThingsTree} from '../Util';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchIds', 'watchThings']
}, {
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles(theme => ({
    grid: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(1),
    },
    card: {
        backgroundColor: '#141719',
        padding: theme.spacing(2),
        overflowX: 'auto',
    },
    tabs: {
        marginBottom: theme.spacing(2),
    },
    red: {
        color: theme.palette.primary.red,
        opacity: '0.6',
        '&:hover': {
            color: theme.palette.primary.red,
            opacity: '0.4',
        },
    },
    green: {
        color: theme.palette.primary.green,
        '&:hover': {
            color: theme.palette.primary.green,
            opacity: '0.7',
        },
    },
}));

const Watcher = ({watchIds, watchThings, collections}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [state, setState] = React.useState({
        scope: '',
        thingId: 3,
    });
    const {scope, thingId} = state;

    const scopes = collections.map(c=>`@collection:${c.name}`);
    React.useEffect(() => {
        setState({...state, scope: scopes[0]});
    },
    [scopes.length],
    );

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    const handleWatch = () => {
        EventActions.watch(
            scope,
            thingId,
        );
    };

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value});
    };

    const handleUnwatch = (id) => () => {
        let s;
        Object.entries(watchIds).map(
            ([k, v]) =>  {
                if(v.includes(id)){
                    s = k;
                }
            }
        );
        EventActions.unwatch(
            s,
            id,
        );
    };

    const replacer = (key, value) => typeof value === 'string' && value.includes('download/tmp/thingsdb-cache-') ? '<blob data>' : value;

    return (
        <Grid container spacing={2}>
            <Grid className={classes.grid} container item xs={12} spacing={1} alignItems="center" >
                <Typography>
                    {'Add a thing ID to watch:'}
                </Typography>
            </Grid>
            <Grid className={classes.grid} container item xs={12} spacing={1} alignItems="center" >
                <Grid item>
                    <TextField
                        type="text"
                        name="scope"
                        onChange={handleChange}
                        value={scope}
                        variant="outlined"
                        select
                        SelectProps={{native: true}}
                    >
                        {scopes.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item>
                    <TextField
                        autoFocus
                        name="thingId"
                        inputProps={{min: '3'}}
                        label="Thing id"
                        type="number"
                        value={thingId}  // TODOK placeholder
                        variant="outlined"
                        spellCheck={false}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <Tooltip disableFocusListener disableTouchListener title="Turn watching on">
                        <ButtonBase onClick={handleWatch}>
                            <AddIcon color="primary" fontSize="large" />
                        </ButtonBase>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Collapse in={Object.keys(watchThings).length>0} timeout="auto">
                    <Paper className={classes.card} >
                        <Tabs className={classes.tabs} value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                            <Tab label="Tree view" />
                            <Tab label="JSON view" />
                        </Tabs>
                        <List
                            component="nav"
                            dense
                            disablePadding
                        >
                            {Object.entries(watchThings).map(([k, v]) => k === '#' ? null : (
                                <Grid container spacing={2} key={k}>
                                    <Grid item xs={11}>
                                        {tabIndex === 0 &&
                                            <ThingsTree
                                                tree={v}
                                                child={{
                                                    name:'',
                                                    index:null,
                                                }}
                                                root
                                            />
                                        }
                                        {tabIndex === 1 &&
                                            <pre>
                                                { JSON.stringify(v, replacer, 4)}
                                            </pre>
                                        }
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Tooltip disableFocusListener disableTouchListener title="Turn watching off">
                                            <ButtonBase onClick={handleUnwatch(k)}>
                                                <RemoveIcon className={classes.red} fontSize="small" />
                                            </ButtonBase>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            ))}
                        </List>
                    </Paper>
                </Collapse>
            </Grid>
        </Grid>
    );
};

Watcher.propTypes = {
    /* event properties */
    watchThings: EventStore.types.watchThings.isRequired,
    watchIds: EventStore.types.watchIds.isRequired,

    /* event properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Watcher);
