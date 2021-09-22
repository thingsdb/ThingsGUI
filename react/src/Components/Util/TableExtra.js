import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import TableWithBadges from './TableWithBadges';
import {DATE_TIME_SEC_STR} from '../../Constants/DateStrings';


const TableExtra = ({badgeButton, buttons, createdAt, header, modifiedAt, onAdd, rows}) => (
    <Grid container>
        <Grid item xs={12}>
            <TableWithBadges
                header={header}
                rows={rows}
                badgeButton={badgeButton}
                buttons={buttons}
            />
        </Grid>
        <Grid container item xs={12}>
            {onAdd && (
                <Grid item xs={2}>
                    <Button color="primary" onClick={onAdd} >
                        <AddIcon color="primary" />
                    </Button>
                </Grid>
            )}
            <Grid container item xs={onAdd?10:12} justifyContent="flex-end">
                <Box fontSize={10} fontStyle="italic" m={1}>
                    {createdAt&&`Created on: ${moment(createdAt*1000).format(DATE_TIME_SEC_STR)}${modifiedAt?`, last modified on: ${moment(modifiedAt*1000).format(DATE_TIME_SEC_STR)}`:''}`}
                </Box>
            </Grid>
        </Grid>
    </Grid>
);


TableExtra.defaultProps = {
    badgeButton: null,
    buttons: null,
    createdAt: null,
    modifiedAt: null,
    onAdd: null,
};

TableExtra.propTypes = {
    badgeButton: PropTypes.func,
    buttons: PropTypes.func,
    createdAt: PropTypes.number,
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    modifiedAt: PropTypes.number,
    onAdd: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TableExtra;
