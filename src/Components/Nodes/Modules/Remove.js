import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';

import {NodesActions} from '../../../Stores';
import {ErrorMsg, SimpleModal} from '../../Util';
import {RemoveModuleTAG} from '../../../constants';

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
                <IconButton onClick={handleClickOpen}>
                    <DeleteIcon color="primary" />
                </IconButton>
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