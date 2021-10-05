import {withVlow} from 'vlow';
import TimerIcon from '@mui/icons-material/Timer';
import React from 'react';

import {AddTimerDialog} from '../ProceduresAndTimers';
import {Menu, orderByName} from '../Utils';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';
import {TIMER_ROUTE} from '../../Constants/Routes';
import {TimerActions, TimerStore} from '../../Stores';

const withStores = withVlow([{
    store: TimerStore,
    keys: ['timers']
}]);


const scope = THINGSDB_SCOPE;
const TimersMenu = ({timers}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        TimerActions.getTimers(scope);
    }, []);

    const handleRefresh = () => {
        TimerActions.getTimers(scope);
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const orderedTimers = orderByName(timers[scope]||[], 'id');

    return (
        <React.Fragment>
            <Menu
                homeRoute={TIMER_ROUTE}
                icon={<TimerIcon color="primary" />}
                itemKey="id"
                items={orderedTimers}
                onAdd={handleClickAdd}
                onRefresh={handleRefresh}
                title="timers"
            />
            <AddTimerDialog open={open} onClose={handleClose} scope={scope} />
        </React.Fragment>
    );
};

TimersMenu.propTypes = {

    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(TimersMenu);