import PropTypes from 'prop-types';
import React from 'react';

import AddTimerDialog from './AddTimerDialog';
import EditTimerDialog from './EditTimerDialog';
import RunTimerDialog from './RunTimerDialog';
import ViewTimerDialog from './ViewTimerDialog';
import {EditProvider} from '../../Collections/CollectionsUtils';


const TimerDialogs = ({id, timers, scope, open, onClose}) => {
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
            <ViewTimerDialog open={view} onClose={handleCloseView} timer={selectedTimer||{}} />
            <AddTimerDialog open={add} onClose={handleCloseAdd} scope={scope} />
            <EditTimerDialog open={edit} onClose={handleCloseEdit} timer={selectedTimer||{}} scope={scope} />
            <EditProvider>
                <RunTimerDialog open={run} onClose={handleCloseRun} timer={selectedTimer||{}} scope={scope} />
            </EditProvider>
        </React.Fragment>
    );
};

TimerDialogs.defaultProps = {
    id: null,
};

TimerDialogs.propTypes = {
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
