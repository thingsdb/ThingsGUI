import Button from '@mui/material/Button';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from 'prop-types';
import React from 'react';

import {Info, SimpleModal} from '../../Utils';

const BackupInfo = ({
    header,
    item = {},
}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return (
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen}>
                    <MoreIcon color="primary" />
                </Button>
            }
            open={show}
            onClose={handleClickClose}
            maxWidth="sm"
            title="Backup info"
        >
            <Info
                header={
                    [{ky: 'title1', title: '', labels: header}]
                }
                content={item}
            />
        </SimpleModal>
    );
};

BackupInfo.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    item: PropTypes.object,
};

export default BackupInfo;