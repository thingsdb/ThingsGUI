import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { SimpleModal } from '../../Utils';
import { ViewProcedure } from '../Content';


const ViewProcedureDialog = ({
    button = null,
    open,
    onClose,
    procedure = {},
}: Props) => (
    <SimpleModal
        button={button}
        open={open}
        onClose={onClose}
        maxWidth="md"
        actionButtons={procedure.with_side_effects?(
            <ListItem>
                <Typography variant="caption" sx={{color: amber[700]}}>
                    {'Note: this procedure generates an event.'}
                </Typography>
            </ListItem>
        ):null}
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} size={12}>
                <Grid size={8}>
                    <Typography variant="body1" >
                        {'View ThingDB procedure:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {procedure.name || ''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid size={12}>
                <ViewProcedure procedure={procedure} />
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
};

export default ViewProcedureDialog;

interface Props {
    button: any;
    open: boolean;
    onClose: any;
    procedure: any;
}