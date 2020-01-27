/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core';
import {withVlow} from 'vlow';
import FailedIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SuccessIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { TableWithButtons } from '../../Util';
import {NodesActions, NodesStore} from '../../../Stores';
import Add from './Add';
import Remove from './Remove';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['backups']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        maxHeight: '400px',
    },
    green: {
        color: theme.palette.primary.green,
    },
    yellow: {
        color: theme.palette.primary.yellow,
    },
    red: {
        color: theme.palette.primary.red,
    },
}));

const header = [
    {ky: 'id', label: 'ID'},
    {ky: 'created_at', label: 'Created on'},
    {ky: 'file_template', label: 'File template'},
    {ky: 'next_run', label: 'Next run at (UTC)'},
    {ky: 'repeat', label: 'Repeat after (sec)'},
    {ky: 'result_code', label: 'Result code'},
    {ky: 'result_message', label: 'Result message'},

];

const Backup = ({nodeId, offline, backups}) => {
    const classes = useStyles();
    React.useEffect(() => {
        const setPoll = setInterval(
            () => {
                NodesActions.getBackups(nodeId);
            }, 5000);
        return () => {
            clearInterval(setPoll);
        };
    }, []);

    const handleRowClick = () => null;

    const handleButtons = (backup) => <Remove nodeId={nodeId} backup={backup} />;
    console.log('backups', backups);
    const rows = JSON.parse(JSON.stringify(backups));

    rows.map(b=> {
        b.created_at = moment(b.created_at*1000).format('YYYY-MM-DD HH:mm:ss');
        b.next_run = b.next_run == 'pending' ? (
            <Tooltip disableFocusListener disableTouchListener title='pending'>
                <ScheduleIcon className={classes.yellow} />
            </Tooltip>
        ) : b.next_run;
        const res_code = b.result_code;
        console.log(res_code);
        b.result_code = b.result_code==undefined ? (
            b.result_code
        ) : b.result_code == 0 ? (
            <Tooltip disableFocusListener disableTouchListener title={res_code}>
                <SuccessIcon className={classes.green} />
            </Tooltip>
        ) : (
            <Tooltip disableFocusListener disableTouchListener title={res_code}>
                <FailedIcon color="error" />
            </Tooltip>
        );

        console.log(b);
        return b;
    });

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} className={classes.overflow}>
                {backups.length ? (
                    <TableWithButtons header={header} rows={rows} rowClick={handleRowClick} buttons={handleButtons} />
                ) : (
                    <Typography variant="subtitle2">
                        {'no backup information'}
                    </Typography>
                )}
            </Grid>
            {offline ? null : (
                <Grid item xs={12}>
                    <Add nodeId={nodeId} />
                </Grid>
            )}
        </Grid>
    );
};

Backup.propTypes = {
    nodeId: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,

    /* nodes properties */
    backups: NodesStore.types.backups.isRequired,
};

export default withStores(Backup);