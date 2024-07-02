import PropTypes from 'prop-types';
import React from 'react';

import { ErrorMsg, SimpleModal } from '../../Utils';
import { TaskActions } from '../../../Stores';
import { CancelTaskTAG } from '../../../Constants/Tags';


const tag = CancelTaskTAG;

const CancelTaskDialog = ({
    button = null,
    open,
    onClose,
    scope,
    task = {},
}) => {
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setName(task.id);
    }, [task.id]);

    const handleClickOk = () => {
        TaskActions.cancelTask(
            scope,
            task.id,
            tag,
            () => {
                TaskActions.getTask(scope, task.id, tag);
                onClose();
            });
    };

    return(
        <SimpleModal
            button={button}
            title={`Cancel ${name}`}
            open={open}
            onOk={handleClickOk}
            onClose={onClose}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

CancelTaskDialog.propTypes = {
    button: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    scope: PropTypes.string.isRequired,
    task: PropTypes.object,
};

export default CancelTaskDialog;