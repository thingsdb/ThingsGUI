import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { THINGSDB_SCOPE } from '../../../Constants/Scopes';
import { EditProcedure, EditTask } from '../Content';

const scope = THINGSDB_SCOPE;

const Edit = ({item, type}) => (
    <Grid item xs={12}>
        <Card>
            <CardContent>
                {type === 'procedure' ? <EditProcedure procedure={item} scope={scope} /> : <EditTask scope={scope} task={item} />}
            </CardContent>
        </Card>
    </Grid>
);

Edit.defaultProps = {
    item: {},
};

Edit.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Edit;
