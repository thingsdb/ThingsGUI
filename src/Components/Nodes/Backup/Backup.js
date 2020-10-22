/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
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

import { Buttons } from '../Utils';
import {FixedList, TableWithButtons} from '../../Util';
import {NodesActions, NodesStore} from '../../../Stores';
import Add from './Add';
import BackupInfo from './BackupInfo';
import Remove from './Remove';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['backups']
}]);

const useStyles = makeStyles(theme => ({
    overflow: {
        marginTop: theme.spacing(2),
        overflowY: 'auto',
        overflowX: 'auto',
        maxHeight: '400px',
    },
    green: {
        color: theme.palette.primary.green,
    },
    yellow: {
        color: theme.palette.primary.yellow,
    },
}));

const header = [
    {ky: 'id', label: 'ID'},
    {ky: 'result_code', label: 'Result code'},
    {ky: 'result_message', label: 'Result message'},
    {ky: 'file_template', label: 'File template'},
    {ky: 'files', label: 'Files'},
    {ky: 'max_files', label: 'Max files'},
    {ky: 'next_run', label: 'Next run at (UTC)'},
    {ky: 'repeat', label: 'Repeat after (sec)'},
    {ky: 'created_at', label: 'Created on'},
];

const headerTable = [
    {ky: 'id', label: 'ID'},
    {ky: 'result_code', label: 'Result code'},
    {ky: 'file_template', label: 'File template'},
];

const link = 'https://docs.thingsdb.net/v0/node-api/backup_info/';

const Backup = ({nodeId, offline, backups}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        NodesActions.getBackups(nodeId); // update of the selected node; to get the latest info
    };

    const handleButtons = (backup) => (
        <React.Fragment>
            <Remove nodeId={nodeId} backup={backup} />
            <BackupInfo header={header} item={backup} />
        </React.Fragment>
    );

    const rows = JSON.parse(JSON.stringify(backups)); // copy

    rows.forEach(b=> {
        b.created_at = moment(b.created_at*1000).format('YYYY-MM-DD HH:mm:ss');
        b.next_run = b.next_run == 'pending' ? (
            <Tooltip disableFocusListener disableTouchListener title='pending'>
                <ScheduleIcon className={classes.yellow} />
            </Tooltip>
        ) : b.next_run;
        const res_code = b.result_code;
        b.result_code = b.result_code === undefined ? (
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
        b.files = <FixedList dense items={b.files} />;
    });

    return (
        <Grid
            container
            spacing={3}
        >
            <Grid item xs={12} className={classes.overflow}>
                {backups.length ? (
                    <TableWithButtons header={headerTable} rows={rows} buttons={handleButtons} />
                ) : (
                    <Typography variant="subtitle2">
                        {'no backup information'}
                    </Typography>
                )}
            </Grid>
            {offline ? null : (
                <Buttons
                    extraButtons={[<Add key="add_button" nodeId={nodeId} />]}
                    link={link}
                    onRefresh={handleRefresh}
                />
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