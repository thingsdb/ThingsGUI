/*eslint-disable react/no-multi-comp*/
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SimpleModal } from '../../Utils';
import { EditTask } from '../Content';

const ViewEditTaskDialog = ({
    button = null,
    open,
    onClose,
    task = {},
    scope,
}) => (
    <SimpleModal
        button={button}
        open={open}
        onClose={onClose}
        maxWidth="md"
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {'Customizing ThingDB task:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {task.id || ''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <EditTask scope={scope} taskId={task.id} />
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewEditTaskDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default ViewEditTaskDialog;