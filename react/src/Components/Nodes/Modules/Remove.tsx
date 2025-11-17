import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import React from 'react';

import { NodesActions } from '../../../Stores';
import { RemoveModal } from '../../Utils';
import { RemoveModuleTAG } from '../../../Constants/Tags';

const tag = RemoveModuleTAG;

const Remove = ({nodeId, item}: Props) => {
    const handleClickOk = (callback: () => void) => {
        NodesActions.delModule(
            nodeId,
            item.name,
            callback
        );
    };

    return (
        <RemoveModal
            buttonComponent={Button}
            buttonLabel={<DeleteIcon color="primary" />}
            buttonProps={{color: 'primary'}}
            onSubmit={handleClickOk}
            tag={tag}
            title={`Remove '${item.name}'`}
        />
    );
};

Remove.propTypes = {
    nodeId: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
};

export default Remove;

interface Props {
    nodeId: number;
    item: IModule;
}