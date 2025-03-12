import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { THINGSDB_SCOPE } from '../../../Constants/Scopes';
import { EditProcedure, EditTask } from '../Content';
import { Cancel, Remove } from '../Actions';

const scope = THINGSDB_SCOPE;

const Edit = ({
    item = {},
    type
}: Props) => {
    const buttons = {
        task: <Cancel item={item} scope={scope} />
    };

    return (
        <Grid size={12}>
            <Card>
                <CardContent>
                    {type === 'procedure' ? <EditProcedure procedure={item} scope={scope} /> : <EditTask scope={scope} taskId={item.id} />}
                </CardContent>
                <CardActions>
                    <Grid container size={12} spacing={1} >
                        <Grid>
                            {buttons[type]}
                        </Grid>
                        <Grid>
                            <Remove item={item} scope={scope} type={type} />
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    );
};

Edit.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string.isRequired,
};

export default Edit;


interface Props {
    item: any;
    type: string;
}
