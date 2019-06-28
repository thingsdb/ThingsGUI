import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const NodeInfo = ({node}) => {
    const header = [
        {ky: 'archived_on_disk', label: 'Archived on disk'},
        {ky: 'client_port', label: 'Client port'},
        {ky: 'events_in_archive', label: 'Events in archive'},
        {ky: 'events_in_queue', label: 'Events in queue'},
        {ky: 'global_commited_event_id', label: 'Global commited event ID'},
        {ky: 'hostname', label: 'Hostname'},
        {ky: 'ip_support', label: 'IP support'},
        {ky: 'local_commited_event_id', label: 'Local commited event ID'},
        {ky: 'local_stored_event_id', label: 'Local stored event ID'},
        {ky: 'log_level', label: 'Loglevel'},
        {ky: 'node_id', label: 'Node ID'},
        {ky: 'node_port', label: 'Node port'},
        {ky: 'status', label: 'Status'},
        {ky: 'storage_path', label: 'Storage path'},
        {ky: 'version', label: 'Version'},
        {ky: 'zone', label: 'Zone'},
    ];
    
    return (
        <Grid container spacing={0}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={3}>
                        <Typography>
                            {h.label}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography>
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