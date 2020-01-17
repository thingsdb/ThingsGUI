/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import { TableWithButtons } from '../../Util';
import Remove from './Remove';


const Backup = ({backups, nodeId}) => {
    const rows = backups;
    const header = [
        {ky: 'id', label: 'ID'},
        {ky: 'created_at', label: 'Created at'},
        {ky: 'file_template', label: 'File template'},
        {ky: 'next_run', label: 'Next run at (UTC)'},
        {ky: 'repeat', label: 'Repeat after (sec)'},
        {ky: 'result_code', label: 'Result code'},
        {ky: 'result_message', label: 'Result message'},

    ];
    const handleRowClick = () => null;

    const handleButtons = (backup) => <Remove nodeId={nodeId} backup={backup} />;

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