/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreHoriz';

import {Info, SimpleModal} from '../../Util';

const BackupInfo = ({header, item}) => {
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
                <IconButton onClick={handleClickOpen}>
                    <MoreIcon color="primary" />
                </IconButton>
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

BackupInfo.defaultProps = {
    item: {},
};

BackupInfo.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    item: PropTypes.object,
};

export default BackupInfo;