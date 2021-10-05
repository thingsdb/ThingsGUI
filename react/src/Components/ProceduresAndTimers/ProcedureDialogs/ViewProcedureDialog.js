import { amber } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DATE_TIME_MIN_STR } from '../../../Constants/DateStrings';
import { SimpleModal } from '../../Util';


const ViewProcedureDialog = ({button, open, onClose, procedure}) => (
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
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {'View ThingDB procedure:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {procedure.name || ''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List disablePadding dense>
                    <ListItem>
                        <ListItemText
                            primary="Created at"
                            secondary={moment(procedure.created_at * 1000).format(DATE_TIME_MIN_STR)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Documentation"
                            secondary={procedure.doc || '-'}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Procedure arguments"
                            secondary={`[${procedure.arguments}]`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Definition"
                            secondary={procedure.definition ?
                                <TextField
                                    fullWidth
                                    multiline
                                    name="procedure"
                                    type="text"
                                    value={procedure.definition || '-'}
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    inputProps={{
                                        style: {
                                            fontFamily: 'monospace',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                : '-'}
                            secondaryTypographyProps={{
                                component: 'div'
                            }}
                        />
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewProcedureDialog.defaultProps = {
    button: null,
    procedure: {},
};

ViewProcedureDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object,
};

export default ViewProcedureDialog;
