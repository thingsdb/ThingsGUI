import PropTypes from 'prop-types';
import React from 'react';

import { EditProvider } from '../../Utils';
import AddTaskDialog from './AddTaskDialog';
import EditTaskDialog from './EditTaskDialog';
import RunTaskDialog from './RunTaskDialog';
import ViewTaskDialog from './ViewTaskDialog';


const TaskDialogs = ({dialogsView, id, tasks, scope, open, onClose}) => {
    const {add, edit, run, view} = open;
    const handleCloseEdit = () => {
        onClose({edit: false});
    };

    const handleCloseAdd = () => {
        onClose({add: false});
    };

    const handleCloseRun = () => {
        onClose({run: false});
    };

    const handleCloseView = () => {
        onClose({view: false});
    };

    let selectedTask = id ? tasks.find(i=>i.id == id):{};

    return (
        <React.Fragment>
            {dialogsView.view && <ViewTaskDialog open={view} onClose={handleCloseView} task={selectedTask||{}} scope={scope} />}
            {dialogsView.add && <AddTaskDialog open={add} onClose={handleCloseAdd} scope={scope} />}
            {dialogsView.edit && <EditTaskDialog open={edit} onClose={handleCloseEdit} task={selectedTask||{}} scope={scope} />}
            {dialogsView.run &&
                <EditProvider>
                    <RunTaskDialog open={run} onClose={handleCloseRun} task={selectedTask||{}} scope={scope} />
                </EditProvider>}
        </React.Fragment>
    );
};

TaskDialogs.defaultProps = {
    id: null,
};

TaskDialogs.propTypes = {
    dialogsView: PropTypes.object.isRequired,
    id: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.shape({
        add: PropTypes.bool,
        edit: PropTypes.bool,
        run: PropTypes.bool,
        view: PropTypes.bool,
    }).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default TaskDialogs;
