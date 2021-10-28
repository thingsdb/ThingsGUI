import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { THINGSDB_SCOPE } from '../../../Constants/Scopes';
import { ViewProcedure, ViewTask } from '../Content';

const scope = THINGSDB_SCOPE;

const View = ({item, type}) => (
    <Grid item xs={12}>
        <Card>
            <CardContent>
                {type === 'procedure' ? <ViewProcedure procedure={item} /> : <ViewTask scope={scope} task={item} />}
            </CardContent>
        </Card>
    </Grid>
);

View.defaultProps = {
    item: {},
};

View.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default View;
