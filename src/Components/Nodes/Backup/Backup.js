/* eslint-disable react/no-multi-comp */
import moment from 'moment';
import PropTypes from 'prop-types';
import ScheduleIcon from  '@material-ui/icons/Schedule';
import SuccessIcon from  '@material-ui/icons/Check';
import FailedIcon from  '@material-ui/icons/Close';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography';

import { TableWithButtons } from '../../Util';
import Remove from './Remove';


const Backup = ({backups, nodeId}) => {
    // const rows = backups;
    const header = [
        {ky: 'id', label: 'ID'},
        {ky: 'created_at', label: 'Created on'},
        {ky: 'file_template', label: 'File template'},
        {ky: 'next_run', label: 'Next run at (UTC)'},
        {ky: 'repeat', label: 'Repeat after (sec)'},
        {ky: 'result_code', label: 'Result code'},
        {ky: 'result_message', label: 'Result message'},

    ];
    const handleRowClick = () => null;

    const handleButtons = (backup) => <Remove nodeId={nodeId} backup={backup} />;

    const rows = backups.map(b=> {
        b.created_at = moment(b.created_at*1000).format('YYYY-MM-DD HH:mm:ss');
        b.repeat = b.repeat == 'pending' ? (
            <Tooltip disableFocusListener disableTouchListener title='pending'>
                <ScheduleIcon />
            </Tooltip>
        ) : b.repeat;
        b.result_code = b.result_code == 0 ? (
            <Tooltip disableFocusListener disableTouchListener title={b.result_code}>
                <SuccessIcon color="action" />
            </Tooltip>
        ) : (
            <Tooltip disableFocusListener disableTouchListener title={b.result_code }>
                <FailedIcon color="error" />
            </Tooltip>);
        return b;
    });

    return (
        <React.Fragment>
            {backups.length ? (
                <TableWithButtons header={header} rows={rows} rowClick={handleRowClick} buttons={handleButtons} />
            ) : (
                <Typography variant="subtitle2">
                    {'no backup information'}
                </Typography>
            )}
        </React.Fragment>
    );
};

Backup.propTypes = {
    backups: PropTypes.arrayOf(PropTypes.object).isRequired,
    nodeId: PropTypes.number.isRequired,
};

export default Backup;