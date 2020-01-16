import PropTypes from 'prop-types';
import React from 'react';
import { Info } from '../../Util';


const NodeInfo = ({node}) => {

    const header = [
        {ky: 'title1', title: 'GENERAL', labels: [
            {ky: 'node_id', label: 'Node ID'},
            {ky: 'hostname', label: 'Hostname'},
            {ky: 'status', label: 'Status'},
            {ky: 'log_level', label: 'Log level'},
            {ky: 'ip_support', label: 'IP support'},
            {ky: 'storage_path', label: 'Storage path'},
            {ky: 'uptime', label: 'Uptime'},
            {ky: 'zone', label: 'Zone'},
            {ky: 'scheduled_backups', label: 'Scheduled backups'},
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


    return (
        <Info header={header} content={node} />
    );
};

NodeInfo.propTypes = {
    node: PropTypes.object.isRequired
};

export default NodeInfo;