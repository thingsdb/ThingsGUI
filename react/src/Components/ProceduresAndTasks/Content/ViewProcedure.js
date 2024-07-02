import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { DATE_TIME_MIN_STR } from '../../../Constants/DateStrings';


const ViewProcedure = ({
    procedure = {},
}) => (
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
);

ViewProcedure.propTypes = {
    procedure: PropTypes.object,
};

export default ViewProcedure;
