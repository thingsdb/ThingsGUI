import { Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { PROCEDURE_ROUTE } from '../../Constants/Routes';


const ProcedureCard = ({procedure}: Props) => (
    <Card sx={{backgroundColor: 'background.default'}}>
        <CardActionArea
            component={RouterLink}
            to={`/${PROCEDURE_ROUTE}/${procedure.name}`}
            sx={{paddingTop: '10px'}}
        >
            <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{fontSize: 14}}>
                    {procedure.doc}
                </Typography>
                <Typography variant="h5" component="h2">
                    {procedure.name}
                </Typography>
                <Typography variant="body2" gutterBottom component='div' color="textSecondary" sx={{marginBottom: '12px', display: 'flex'}}>
                    <Box>
                        {'Created: '}
                    </Box>
                    <Box sx={{fontWeight: 'bold', marginLeft: '8px'}}>
                        {moment.unix(procedure.created_at).fromNow()}
                    </Box>
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card >
);

ProcedureCard.propTypes = {
    procedure: PropTypes.object.isRequired,
};

export default ProcedureCard;

interface Props {
    procedure: any;
}