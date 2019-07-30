import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const NodeInfo = ({node}) => {
    const header = [
        {ky: 'archive_files', label: 'Archived files'},
        {ky: 'archived_in_memory', label: 'Archived in memory'},
        {ky: 'cached_names', label: 'Cached names'},
        {ky: 'client_port', label: 'Client port'},
        {ky: 'db_stored_event_id', label: 'Stored event ID'},
        {ky: 'events_in_queue', label: 'Events in queue'},
        {ky: 'global_committed_event_id', label: 'Global committed event ID'},
        {ky: 'hostname', label: 'Hostname'},
        {ky: 'http_status_port', label: 'HTTP status port'},
        {ky: 'ip_support', label: 'IP support'},
        {ky: 'local_committed_event_id', label: 'Local committed event ID'},
        {ky: 'local_stored_event_id', label: 'Local stored event ID'},
        {ky: 'log_level', label: 'Loglevel'},
        {ky: 'node_id', label: 'Node ID'},
        {ky: 'node_port', label: 'Node port'},
        {ky: 'status', label: 'Status'},
        {ky: 'storage_path', label: 'Storage path'},
        {ky: 'uptime', label: 'Uptime'},
        {ky: 'version', label: 'Version'},
        {ky: 'zone', label: 'Zone'},
    ];
    
    return (
        <Grid container spacing={0}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={6}>
                        <Typography variant={'caption'} >
                            {h.label + ':'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant={'subtitle2'} >
                            {node[h.ky]}
                        </Typography>
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    );
};

NodeInfo.propTypes = {
    node: PropTypes.object.isRequired
};

export default NodeInfo;