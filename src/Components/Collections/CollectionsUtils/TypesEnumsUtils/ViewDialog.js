/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../../Util';
import OverviewTypes from './OverviewTypes';


const ViewDialog = ({feature, item, onChangeItem, onClose, open, rows, usedBy}) => (
    <SimpleModal
        open={open}
        onClose={onClose}
        maxWidth="sm"
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {`View ThingDB ${feature}:`}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {item.name||''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List disablePadding dense>
                    <OverviewTypes item={item} onChangeType={onChangeItem} rows={rows} usedBy={usedBy} />
                </List>
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewDialog.defaultProps = {
    item: {},
};

ViewDialog.propTypes = {
    feature: PropTypes.string.isRequired,
    item: PropTypes.object,
    onChangeItem: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    usedBy: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ViewDialog;
