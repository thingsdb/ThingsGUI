/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../../Util';
import Overview from './Overview';


const ViewDialog = ({feature, item, link, onChangeItem, onClose, open, rows, usedBy}) => (
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
                    <Overview feature={feature} item={item} link={link} onChangeItem={onChangeItem} rows={rows} usedBy={usedBy} />
                </List>
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewDialog.defaultProps = {
    item: {},
    usedBy: [],
    onChangeItem: ()=>null,
};

ViewDialog.propTypes = {
    feature: PropTypes.string.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    usedBy: PropTypes.arrayOf(PropTypes.object),
};

export default ViewDialog;
