import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogContentText from '@mui/material/DialogContentText';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';
import {RemoveNodeTAG} from '../../../Constants/Tags';

const tag = RemoveNodeTAG;

const Remove = ({node}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.delNode(
            node.node_id,
            tag,
            () => setShow(false)
        );
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    return(
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen}>
                    <DeleteIcon color="primary" />
                </Button>
            }
            title="CAUTION"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            <ErrorMsg tag={tag} />
            <DialogContentText>
                {'Are you sure you want to remove this node?'}
            </DialogContentText>
        </SimpleModal>
    );
};

Remove.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Remove;