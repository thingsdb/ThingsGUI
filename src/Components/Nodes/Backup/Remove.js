import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {NodesActions} from '../../../Stores';
import {ErrorMsg, SimpleModal, TwoLabelSwitch} from '../../Util';
import {RemoveBackupTAG} from '../../../constants';

const tag = RemoveBackupTAG;

const Remove = ({nodeId, backup}) => {
    const [show, setShow] = React.useState(false);
    const [deleteFile, setDeleteFile] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
        setDeleteFile(false);
    };

    const handleDeleteFile = ({target}) => {
        const {checked} = target;
        setDeleteFile(checked);
    };

    const handleClickOk = () => {
        NodesActions.delBackup(nodeId, backup.id, handleClickClose,deleteFile);
    };

    return (
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen}>
                    <DeleteIcon color="primary" />
                </Button>
            }
            title={`Remove back up with ID: ${backup.id}`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            <React.Fragment>
                <ErrorMsg tag={tag} />
                <Typography component="div" variant="body1">
                    <FormLabel component="label">
                        {'Do you also want to delete related backup files from disk (or Google Cloud Storage)?'}
                    </FormLabel>
                    <TwoLabelSwitch
                        input={deleteFile}
                        labelOne="no"
                        labelTwo="yes"
                        onChange={handleDeleteFile}
                    />
                </Typography>
            </React.Fragment>
        </SimpleModal>
    );
};

Remove.propTypes = {
    nodeId: PropTypes.number.isRequired,
    backup: PropTypes.object.isRequired,
};

export default Remove;