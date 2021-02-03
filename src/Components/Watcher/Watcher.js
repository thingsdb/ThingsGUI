import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import AddIcon from '@material-ui/icons/Add';
import AddOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutlined';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {EventActions, EventStore, ThingsdbStore, TypeActions, TypeStore} from '../../Stores';
import {ErrorMsg, HarmonicTree} from '../Util';
import {WatcherTAG} from '../../constants';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchEvents', 'watchEnums', 'watchIds', 'watchThings', 'watchProcedures', 'watchTypes']
}, {
    store: ThingsdbStore,
    keys: ['collections']
}, {
    store: TypeStore,
    keys: ['customTypes']
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

const tag = WatcherTAG;

const Watcher = ({collections, customTypes, watchEvents, watchEnums, watchIds, watchProcedures, watchThings, watchTypes}) => {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = React.useState(0);
    const [state, setState] = React.useState({
        scope: '',
        thingId: 3,
    });
    const {scope, thingId} = state;

    const scopes = React.useMemo(() => collections.map(c=>`@collection:${c.name}`), [collections]);

    React.useEffect(() => {
        setState((state) => ({...state, scope: scopes[0]}));
    }, [scopes]);

    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    const handleWatch = () => {
        EventActions.watch(
            scope,
            thingId,
        );
        TypeActions.getTypes(scope, tag);
    };

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value});
    };

    const handleUnwatch = (id) => () => {
        EventActions.unwatch(
            id,
        );
    };

    const handleClickWatch = (s, id) => () => {
        EventActions.watch(
            s,
            id,
        );
        TypeActions.getTypes(s, tag);
    };

    const handleWatchButton = (s) => (_, t, v) => {
        const id = v.slice(2, -1);
        let onWatch=Boolean(watchIds[id]);

        return(t=='thing'&& (onWatch ? (
            <Tooltip disableFocusListener disableTouchListener title="Turn watching off">
                <Button color="primary" onClick={handleUnwatch(id)} size="small" >
                    <RemoveIcon size="small" className={classes.red} />
                </Button>
            </Tooltip>
        ): (
            <Button color="primary" onClick={handleClickWatch(s, id)} size="small" >
                <AddOutlinedIcon size="small" className={classes.green}  />
            </Button>
        )));
    };

    const replacer = (key, value) => typeof value === 'string' && value.includes('download/tmp/thingsdb-cache-') ? '<blob data>' : value;

    return (
        <Grid container spacing={2}>
            <Grid className={classes.grid} container item xs={12} spacing={1} alignItems="center" >
                <Typography>
                    {'Add a thing ID to watch:'}
                </Typography>
                <ErrorMsg tag={tag} />
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
                        {scopes.map(p => (
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
                        value={thingId}
                        variant="outlined"
                        spellCheck={false}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <Tooltip disableFocusListener disableTouchListener title="Turn watching on">
                        <Fab onClick={handleWatch} color="primary" size="small">
                            <AddIcon size="small" />
                        </Fab>
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
                            <HarmonicTree
                                items={watchThings}
                                jsonReplacer={replacer}
                                jsonView={tabIndex === 1}
                                onAction={handleWatchButton}
                                title="THINGS"
                                customTypes={customTypes}
                            />
                            {Object.keys(watchProcedures).length>0&& (
                                <HarmonicTree
                                    items={watchProcedures}
                                    title="PROCEDURES"
                                    jsonView={tabIndex === 1}
                                    jsonReplacer={replacer}
                                />
                            )}
                            {Object.keys(watchTypes).length>0&& (
                                <HarmonicTree
                                    items={watchTypes}
                                    title="TYPES"
                                    jsonView={tabIndex === 1}
                                    jsonReplacer={replacer}
                                />
                            )}
                            {Object.keys(watchEnums).length>0&& (
                                <HarmonicTree
                                    items={watchEnums}
                                    title="ENUMS"
                                    jsonView={tabIndex === 1}
                                    jsonReplacer={replacer}
                                />
                            )}
                            {Object.keys(watchEvents).length>0&& (
                                <HarmonicTree
                                    items={watchEvents}
                                    title="EVENTS"
                                    jsonView={tabIndex === 1}
                                    jsonReplacer={replacer}
                                />
                            )}
                        </List>
                    </Paper>
                </Collapse>
            </Grid>
        </Grid>
    );
};

Watcher.propTypes = {
    /* event store properties */
    watchEvents: EventStore.types.watchEvents.isRequired,
    watchEnums: EventStore.types.watchEnums.isRequired,
    watchThings: EventStore.types.watchThings.isRequired,
    watchIds: EventStore.types.watchIds.isRequired,
    watchProcedures: EventStore.types.watchProcedures.isRequired,
    watchTypes: EventStore.types.watchTypes.isRequired,

    /* thingsdb store properties */
    collections: ThingsdbStore.types.collections.isRequired,

    /* type store properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(Watcher);
