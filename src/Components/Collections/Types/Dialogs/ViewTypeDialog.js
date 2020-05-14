/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {SimpleModal} from '../../../Util';
import OverviewTypes from './OverviewTypes';


const ViewTypeDialog = ({open, onClose, customType, customTypes, onChangeType}) => {
    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            maxWidth="sm"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'View ThingDB type:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {customType.name||''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <OverviewTypes customType={customType} customTypes={customTypes} onChangeType={onChangeType} />
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

ViewTypeDialog.defaultProps = {
    customType: {},
};

ViewTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChangeType: PropTypes.func.isRequired,
    customType: PropTypes.object,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ViewTypeDialog;
