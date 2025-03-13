import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';

import { RemoveModal } from '../../Utils';
import { NodesActions } from '../../../Stores';
import { ShutdownTAG } from '../../../Constants/Tags';


const tag = ShutdownTAG;

const Shutdown = ({node}: Props) => {

    const handleClickOk = (callback) => {
        NodesActions.shutdown(
            node.node_id,
            tag,
            callback);
    };

    return(
        <RemoveModal
            buttonComponent={Button}
            buttonLabel="Shutdown"
            buttonProps={{variant: 'outlined', color: 'primary'}}
            onSubmit={handleClickOk}
            tag={tag}
            title="Shutdown node"
        />
    );
};

Shutdown.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Shutdown;

interface Props {
    node: INode;
}