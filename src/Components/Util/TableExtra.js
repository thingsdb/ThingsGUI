import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import TableWithBadges from './TableWithBadges';


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
                    <Button onClick={onAdd} >
                        <AddIcon color="primary" />
                    </Button>
                </Grid>
            )}
            <Grid container item xs={onAdd?10:12} justify="flex-end">
                <Box fontSize={10} fontStyle="italic" m={1}>
                    {createdAt&&`Created on: ${moment(createdAt*1000).format('YYYY-MM-DD HH:mm:ss')}${modifiedAt?`, last modified on: ${moment(modifiedAt*1000).format('YYYY-MM-DD HH:mm:ss')}`:''}`}
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
