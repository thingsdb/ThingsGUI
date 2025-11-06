import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SimpleModal } from '../../Utils';
import { ViewTask } from '../Content';


const ViewTaskDialog = ({
    button = null,
    open,
    onClose,
    scope,
    task = {},
}) => (
    <SimpleModal
        button={button}
        open={open}
        onClose={onClose}
        maxWidth="md"
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} size={12}>
                <Grid size={8}>
                    <Typography variant="body1" >
                        {'View ThingDB task:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {task.id || ''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid size={12}>
                <ViewTask task={task} scope={scope} />
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewTaskDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    task: PropTypes.object,
};

export default ViewTaskDialog;
