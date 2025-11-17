import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { Buttons } from '../Utils';
import { Info, scaleToBinBytes } from '../../Utils';
import { NodesActions, NodesStore } from '../../../Stores';
import { THINGS_DOC_NODE_INFO } from '../../../Constants/Links';
import Loglevel from './Loglevel';
import Shutdown from './Shutdown';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['node']
}]);

const header = [
    {ky: 'title1', title: 'GENERAL', labels: [
        {ky: 'node_id', label: 'Node ID'},
        {ky: 'node_name', label: 'Node name'},
        {ky: 'status', label: 'Status'},
        {ky: 'log_level', label: 'Log level'},
        {ky: 'ip_support', label: 'IP support'},
        {ky: 'storage_path', label: 'Storage path'},
        {ky: 'uptime', label: 'Uptime', fn: (d: number) =>  moment.duration(d , 'second').humanize()},
        {ky: 'zone', label: 'Zone'},
        {ky: 'scheduled_backups', label: 'Scheduled backups'},
        {ky: 'connected_clients', label: 'Connected clients'},
        {ky: 'python_interpreter', label: 'Python interpreter'},
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
    {ky: 'title4', title: 'CHANGES & IDs', labels: [
        {ky: 'changes_in_queue', label: 'Changes in queue'},
        {ky: 'global_committed_change_id', label: 'Global committed change ID'},
        {ky: 'global_stored_change_id', label: 'Global stored change ID'},
        {ky: 'db_stored_change_id', label: 'Stored change ID'},
        {ky: 'local_committed_change_id', label: 'Local committed change ID'},
        {ky: 'local_stored_change_id', label: 'Local stored change ID'},
        {ky: 'next_change_id', label: 'Next change ID'},
        {ky: 'next_free_id', label: 'Next free ID'},

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
    {ky: 'title6', title: 'QUERIES', labels: [
        {ky: 'result_size_limit', label: 'Result size limit', fn: scaleToBinBytes},
        {ky: 'cached_queries', label: 'Cached queries'},
        {ky: 'threshold_query_cache', label: 'Threshold query cache'},
        {ky: 'cache_expiration_time', label: 'Cache expiration time', fn: (d: number) =>  moment.duration(d , 'second').humanize()},
    ]},

];

const link = THINGS_DOC_NODE_INFO;

const NodeConfig = ({nodeId, offline, node}: INodesStore & Props) => {

    const handleRefresh = () => {
        NodesActions.getNode(nodeId); // update of the selected node; to get the latest info
    };

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid size={12} sx={{marginTop: '16px', overflowY: 'auto', maxHeight: '400px'}}>
                <Info header={header} content={node} />
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<Loglevel key="loglevel_button" node={node} />, <Shutdown key="shutdown_button" node={node} />]}
                    link={link}
                    onRefresh={handleRefresh}
                    title="node info"
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

interface Props {
    nodeId: number;
    offline: boolean;
}