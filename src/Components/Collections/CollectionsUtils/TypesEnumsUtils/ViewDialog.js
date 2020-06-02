/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../../Util';
import Overview from './Overview';


const ViewDialog = ({category, item, link, onChangeItem, onClose, open, rows, scope}) => (
    <SimpleModal
        open={open}
        onClose={onClose}
        maxWidth="md"
    >
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {`View ThingDB ${category}:`}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {item.name||''}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List disablePadding dense>
                    <Overview category={category} item={item} link={link} onChangeItem={onChangeItem} rows={rows} scope={scope} />
                </List>
            </Grid>
        </Grid>
    </SimpleModal>
);

ViewDialog.defaultProps = {
    item: {},
    onChangeItem: ()=>null,
    open: false,
};

ViewDialog.propTypes = {
    category: PropTypes.string.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default ViewDialog;
