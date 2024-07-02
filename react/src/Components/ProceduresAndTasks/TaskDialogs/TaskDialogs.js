import PropTypes from 'prop-types';
import React from 'react';

import AddTaskDialog from './AddTaskDialog';
import CancelTaskDialog from './CancelTaskDialog';
import ViewEditTaskDialog from './ViewEditTaskDialog';
import ViewTaskDialog from './ViewTaskDialog';


const TaskDialogs = ({
    dialogsView,
    id = null,
    tasks,
    scope,
    open,
    onClose,
}) => {
    const {add, cancel, edit, view} = open;
    const handleCloseEdit = () => {
        onClose({edit: false});
    };

    const handleCloseAdd = () => {
        onClose({add: false});
    };

    const handleCloseView = () => {
        onClose({view: false});
    };

    const handleCloseCancel = () => {
        onClose({cancel: false});
    };

    let selectedTask = id ? tasks.find(i=>i.id == id):{};

    return (
        <React.Fragment>
            {dialogsView.view && <ViewTaskDialog open={view} onClose={handleCloseView} task={selectedTask||{}} scope={scope} />}
            {dialogsView.add && <AddTaskDialog open={add} onClose={handleCloseAdd} scope={scope} />}
            {dialogsView.edit && <ViewEditTaskDialog open={edit} onClose={handleCloseEdit} task={selectedTask||{}} scope={scope} />}
            {dialogsView.cancel && <CancelTaskDialog open={cancel} onClose={handleCloseCancel} task={selectedTask||{}} scope={scope} />}
        </React.Fragment>
    );
};

TaskDialogs.propTypes = {
    dialogsView: PropTypes.object.isRequired,
    id: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.shape({
        add: PropTypes.bool,
        cancel: PropTypes.bool,
        edit: PropTypes.bool,
        run: PropTypes.bool,
        view: PropTypes.bool,
    }).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default TaskDialogs;
