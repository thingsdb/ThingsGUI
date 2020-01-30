import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import {NodesActions} from '../../../Stores';


const Remove = ({nodeId, backup}) => {

    const handleClickOk = () => {
        NodesActions.delBackup(nodeId, backup.id);
    };

    return (
        <IconButton onClick={handleClickOk}>
            <DeleteIcon color="primary" />
        </IconButton>
    );
};

Remove.propTypes = {
    nodeId: PropTypes.number.isRequired,
    backup: PropTypes.object.isRequired,
};

export default Remove;