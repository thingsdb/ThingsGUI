import {makeStyles} from '@material-ui/core/styles';
import {Link as RouterLink} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

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
                        <Box >
                            {'Created: '}
                        </Box>
                        <Box fontWeight="fontWeightBold" className={classes.marginLeft}>
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