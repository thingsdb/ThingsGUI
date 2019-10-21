import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import {NodesActions} from '../../Stores/NodesStore';


const RemoveBackup = ({nodeId, backup}) => {

    const handleClickOk = () => {
        NodesActions.delBackup(nodeId, backup.id);
    };

    return (
        <IconButton onClick={handleClickOk}>
            <DeleteIcon />
        </IconButton>
    );
};

RemoveBackup.propTypes = {
    nodeId: PropTypes.number.isRequired,
    backup: PropTypes.object.isRequired,
};

export default RemoveBackup;