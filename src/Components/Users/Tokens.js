/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';

import AddToken from './AddToken';
import RemoveExpired from './RemoveExpired';
import RemoveToken from './RemoveToken';
import {TableWithButtons} from '../Util';

const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    warning: {
        color: amber[700],
    },
}));

const Tokens = ({user}) => {
    const classes = useStyles();
    const [serverError, setServerError] = React.useState('');

    const rows = user.tokens;
    const header = [{
        ky: 'description',
        label: 'Description',
    }, {
        ky: 'expiration_time',
        label: 'Expiration UTC time',
    }, {
        ky: 'key',
        label: 'Key',
    }, {
        ky: 'status',
        label: 'Status',
    }];
    const handleRowClick = () => null;

    const handleButtons = (token) => <RemoveToken token={token} onServerError={handleServerError} />;

    const handleServerError = (err) => {
        setServerError(err.log);
    };
    const handleCloseError = () => {
        setServerError('');
    };

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} variant="h5" >
                {'TOKENS'}
            </Typography>
            <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                <CardHeader
                    avatar={
                        <WarningIcon className={classes.warning} />
                    }
                    action={
                        <IconButton aria-label="settings" onClick={handleCloseError}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={serverError}
                />
            </Collapse>
            <CardContent>
                <Grid container item xs={9}>
                    {user.tokens.length ? (
                        <TableWithButtons header={header} rows={rows} rowClick={handleRowClick} buttons={handleButtons} />
                    ) : (
                        <Typography >
                            {'Not set.'}
                        </Typography>
                    )}
                </Grid>
            </CardContent>
            <CardActions>
                <RemoveExpired onServerError={handleServerError} />
                <AddToken user={user} />
            </CardActions>
        </Card>
    );
};

Tokens.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Tokens;