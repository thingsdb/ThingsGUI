import Button from '@material-ui/core/Button';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import React from 'react';

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

BackupInfo.defaultProps = {
    item: {},
};

BackupInfo.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    item: PropTypes.object,
};

export default BackupInfo;