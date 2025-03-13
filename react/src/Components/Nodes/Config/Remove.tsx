import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import { RemoveModal } from '../../Utils';
import { NodesActions } from '../../../Stores';
import { RemoveNodeTAG } from '../../../Constants/Tags';

const tag = RemoveNodeTAG;

const Remove = ({node}: Props) => {
    const name = `${node.node_name}:${node.port}`;

    const handleClickOk = (callback) => {
        NodesActions.delNode(
            node.node_id,
            tag,
            callback
        );
    };

    return(
        <RemoveModal
            buttonComponent={Button}
            buttonLabel={<DeleteIcon color="primary" />}
            buttonProps={{color: 'primary'}}
            onSubmit={handleClickOk}
            tag={tag}
            title={name ? `Remove '${name}'` : ''}
        />
    );
};

Remove.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Remove;

interface Props {
    node: INode;
}