import { withVlow } from 'vlow';
import FailedIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SuccessIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Buttons } from '../Utils';
import { DATE_TIME_SEC_STR } from '../../../Constants/DateStrings';
import { FixedList, TableWithButtons } from '../../Utils';
import { NodesActions, NodesStore } from '../../../Stores';
import { THINGS_DOC_BACKUP_INFO } from '../../../Constants/Links';
import Add from './Add';
import BackupInfo from './BackupInfo';
import Remove from './Remove';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['backups']
}]);

const header = [
    {ky: 'id', label: 'ID'},
    {ky: 'result_code', label: 'Result code'},
    {ky: 'result_message', label: 'Result message'},
    {ky: 'file_template', label: 'File template'},
    {ky: 'files', label: 'Files'},
    {ky: 'max_files', label: 'Max files'},
    {ky: 'next_run', label: 'Next run at (UTC)', fn: (t) => t?.slice(-1) === 'Z' ? t?.slice(0, -1) : t},
    {ky: 'repeat', label: 'Repeat after (sec)'},
    {ky: 'created_at', label: 'Created on', fn: (t) => moment(t * 1000).format(DATE_TIME_SEC_STR)},
];

const headerTable = [
    {ky: 'id', label: 'ID'},
    {ky: 'result_code', label: 'Result code'},
    {ky: 'file_template', label: 'File template'},
];

const link = THINGS_DOC_BACKUP_INFO;

const Backup = ({nodeId, offline, backups}) => {
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
        b.next_run = b.next_run == 'pending' ? (
            <Tooltip disableFocusListener disableTouchListener title='pending'>
                <ScheduleIcon sx={{color: 'primary.yellow'}} />
            </Tooltip>
        ) : b.next_run;
        const res_code = b.result_code;
        b.result_code = b.result_code === undefined ? (
            b.result_code
        ) : b.result_code == 0 ? (
            <Tooltip disableFocusListener disableTouchListener title={res_code}>
                <SuccessIcon sx={{color: 'primary.green'}}  />
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
            <Grid size={12} sx={{marginTop: '16px', overflowY: 'auto', overflowX: 'auto', maxHeight: '400px'}}>
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
                    title="backup"
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