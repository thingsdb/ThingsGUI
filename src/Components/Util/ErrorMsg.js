/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import { ErrorActions, ErrorStore } from '../../Stores';


const useStyles = makeStyles(theme => ({
    avatar: {
        backgroundColor: 'transparent',
    },
    div: {
        // minWidth: 280,
    },
    multiline: {
        whiteSpace: 'pre-wrap',
    },
    warning: {
        color: amber[700],
    },
    typography: {
        marginBottom: theme.spacing(1),
    },
}));

const withStores = withVlow([{
    store: ErrorStore,
    keys: ['msgError']
}]);

const ErrorMsg = ({tag, msgError}) => {
    const classes = useStyles();

    React.useEffect(()=>{
        return () => handleCloseError();
    }, []);

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const link = (msgErr) => {
        const startIndex = msgErr.search(/https/);
        const length = msgErr.slice(startIndex).search(/;/);
        if (length!=-1&&length!=0) {
            return(
                <React.Fragment>
                    {msgErr.slice(0, startIndex)}
                    <Link href={msgErr.slice(startIndex, startIndex+length)}>
                        {msgErr.slice(startIndex, startIndex+length)}
                    </Link>
                    {msgErr.includes('https', startIndex+length) ? link(msgErr.slice(startIndex+length)):msgErr.slice(startIndex+length)}
                </React.Fragment>
            );
        } else {
            return(
                <React.Fragment>
                    {msgErr.slice(0, startIndex)}
                    <Link href={msgErr.slice(startIndex)}>
                        {msgErr.slice(startIndex)}
                    </Link>
                </React.Fragment>
            );
        }
    };


    return (
        <React.Fragment>
            <Collapse in={Boolean(msgError[tag])} timeout="auto" unmountOnExit>
                <Typography className={classes.typography} component="div" variant="caption">
                    <Grid component="label" container alignItems="center" spacing={2} item xs={12}>
                        <Grid item xs={2} >
                            <Avatar className={classes.avatar}>
                                <WarningIcon className={classes.warning} />
                            </Avatar>
                        </Grid>
                        <Grid item className={classes.div} xs={8}>
                            {msgError[tag] && msgError[tag].includes('https') ? link(msgError[tag]): msgError[tag]}
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton aria-label="settings" onClick={handleCloseError}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Typography>
            </Collapse>
        </React.Fragment>
    );
};

ErrorMsg.propTypes = {
    msgError: ErrorStore.types.msgError.isRequired,
    tag: PropTypes.string.isRequired,

};

export default withStores(ErrorMsg);