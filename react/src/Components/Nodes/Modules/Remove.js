import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import React from 'react';

import {NodesActions} from '../../../Stores';
import {ErrorMsg, SimpleModal} from '../../Util';
import {RemoveModuleTAG} from '../../../Constants/Tags';

const tag = RemoveModuleTAG;

const Remove = ({nodeId, item}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.delModule(nodeId, item.name, handleClickClose);
    };

    return (
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen}>
                    <DeleteIcon color="primary" />
                </Button>
            }
            title={`Remove module: ${item.name}`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

Remove.propTypes = {
    nodeId: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
};

export default Remove;