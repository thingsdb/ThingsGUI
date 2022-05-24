import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import { RemoveModal } from '../../Utils';
import { NodesActions } from '../../../Stores';
import { RemoveNodeTAG } from '../../../Constants/Tags';

const tag = RemoveNodeTAG;

const Remove = ({node}) => {
    // to prevent update of name to undefined, after it is deleted.
    const [name] = React.useState(`${node.node_name}:${node.port}`); // eslint-disable-line

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
            title={`Remove '${name}'`}
        />
    );
};

Remove.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Remove;