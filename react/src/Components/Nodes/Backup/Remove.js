import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FormLabel from '@mui/material/FormLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {NodesActions} from '../../../Stores';
import {ErrorMsg, SimpleModal, TwoLabelSwitch} from '../../Utils';
import {RemoveBackupTAG} from '../../../Constants/Tags';

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