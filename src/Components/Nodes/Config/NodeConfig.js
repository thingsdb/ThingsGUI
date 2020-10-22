/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { Info } from '../../Util';
import Loglevel from './Loglevel';
import Shutdown from './Shutdown';
import {NodesActions, NodesStore} from '../../../Stores';
import { Buttons } from '../Utils';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['node']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        maxHeight: '400px',
    },
}));

const header = [
    {ky: 'title1', title: 'GENERAL', labels: [
        {ky: 'node_id', label: 'Node ID'},
        {ky: 'node_name', label: 'Node name'},
        {ky: 'status', label: 'Status'},
        {ky: 'log_level', label: 'Log level'},
        {ky: 'ip_support', label: 'IP support'},
        {ky: 'storage_path', label: 'Storage path'},
        {ky: 'uptime', label: 'Uptime'},
        {ky: 'zone', label: 'Zone'},
        {ky: 'scheduled_backups', label: 'Scheduled backups'},
        {ky: 'connected_clients', label: 'Connected clients'},
    ]},
    {ky: 'title2', title: 'PORTS', labels: [
        {ky: 'client_port', label: 'Client port'},
        {ky: 'node_port', label: 'Node port'},
        {ky: 'http_status_port', label: 'HTTP status port'},
        {ky: 'http_api_port', label: 'HTTP api port'},
    ]},
    {ky: 'title3', title: 'ARCHIVE', labels: [
        {ky: 'archive_files', label: 'Archived files'},
        {ky: 'archived_in_memory', label: 'Archived in memory'},
        {ky: 'cached_names', label: 'Cached names'},
    ]},
    {ky: 'title4', title: 'EVENTS & IDs', labels: [
        {ky: 'events_in_queue', label: 'Events in queue'},
        {ky: 'global_committed_event_id', label: 'Global committed event ID'},
        {ky: 'global_stored_event_id', label: 'Global stored event ID'},
        {ky: 'db_stored_event_id', label: 'Stored event ID'},
        {ky: 'local_committed_event_id', label: 'Local committed event ID'},
        {ky: 'local_stored_event_id', label: 'Local stored event ID'},
        {ky: 'next_event_id', label: 'Next event ID'},
        {ky: 'next_thing_id', label: 'Next thing ID'},

    ]},
    {ky: 'title5', title: 'VERSIONS', labels: [
        {ky: 'version', label: 'ThingsDB version'},
        {ky: 'syntax_version', label: 'Syntax version'},
        {ky: 'libcleri_version', label: 'Libcleri version'},
        {ky: 'libpcre2_version', label: 'Libpcre2 version'},
        {ky: 'msgpack_version', label: 'Msgpack version'},
        {ky: 'libuv_version', label: 'Libuv version'},
        {ky: 'yajl_version', label: 'Yajl version'},
    ]},

];

const link = 'https://docs.thingsdb.net/v0/node-api/node_info/';

const NodeConfig = ({nodeId, offline, node}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getNode(nodeId); // update of the selected node; to get the latest info
    };

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} className={classes.overflow}>
                <Info header={header} content={node} />
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<Loglevel key="loglevel_button" node={node} />, <Shutdown key="shutdown_button" node={node} />]}
                    link={link}
                    onRefresh={handleRefresh}
                />
            )}
        </Grid>
    );
};

NodeConfig.propTypes = {
    nodeId: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,

    /* nodes properties */
    node: NodesStore.types.node.isRequired,
};

export default withStores(NodeConfig);