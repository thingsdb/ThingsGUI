import PropTypes from 'prop-types';
import React from 'react';

import AddTimerDialog from './AddTimerDialog';
import EditTimerDialog from './EditTimerDialog';
import RunTimerDialog from './RunTimerDialog';
import ViewTimerDialog from './ViewTimerDialog';
import { EditProvider } from '../../Utils';


const TimerDialogs = ({dialogsView, id, timers, scope, open, onClose}) => {
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

    let selectedTimer = id ? timers.find(i=>i.id == id):{};

    return (
        <React.Fragment>
            {dialogsView.view && <ViewTimerDialog open={view} onClose={handleCloseView} timer={selectedTimer||{}} scope={scope} />}
            {dialogsView.add && <AddTimerDialog open={add} onClose={handleCloseAdd} scope={scope} />}
            {dialogsView.edit && <EditTimerDialog open={edit} onClose={handleCloseEdit} timer={selectedTimer||{}} scope={scope} />}
            {dialogsView.run &&
                <EditProvider>
                    <RunTimerDialog open={run} onClose={handleCloseRun} timer={selectedTimer||{}} scope={scope} />
                </EditProvider>}
        </React.Fragment>
    );
};

TimerDialogs.defaultProps = {
    id: null,
};

TimerDialogs.propTypes = {
    dialogsView: PropTypes.object.isRequired,
    id: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.shape({
        add: PropTypes.bool,
        edit: PropTypes.bool,
        run: PropTypes.bool,
        view: PropTypes.bool,
    }).isRequired,
    timers: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default TimerDialogs;
