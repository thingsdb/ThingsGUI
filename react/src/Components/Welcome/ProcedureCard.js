import makeStyles from '@mui/styles/makeStyles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {PROCEDURE_ROUTE} from '../../Constants/Routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
    },
    action: {
        paddingTop: 10,
    },
    marginLeft: {
        marginLeft: theme.spacing(1)
    },
    pos: {
        marginBottom: 12,
        display: 'flex'
    },
    title: {
        fontSize: 14,
    },
}));

const ProcedureCard = ({procedure, size}) => {
    const classes = useStyles({size});

    return (
        <Card className={classes.root}>
            <CardActionArea
                className={classes.action}
                component={RouterLink}
                to={location => ({...location, pathname: `/${PROCEDURE_ROUTE}/${procedure.name}`})}
            >
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {procedure.doc}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {procedure.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom component='div' className={classes.pos} color="textSecondary">
                        <Box>
                            {'Created: '}
                        </Box>
                        <Box className={classes.marginLeft} sx={{fontWeight: 'bold'}}>
                            {moment.unix(procedure.created_at).fromNow()}
                        </Box>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
};

ProcedureCard.defaultProps = {
    size: 'default',
};

ProcedureCard.propTypes = {
    procedure: PropTypes.object.isRequired,
    size: PropTypes.string
};

export default ProcedureCard;