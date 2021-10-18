import { useLocation } from 'react-router-dom';
import { withVlow } from 'vlow';
import React from 'react';

import { getIdFromPath, isObjectEmpty } from '../Utils';
import { Page } from './Utils';
import { THINGSDB_SCOPE } from '../../Constants/Scopes';
import { TIMER_ROUTE } from '../../Constants/Routes';
import { TimerActions, TimerStore } from '../../Stores';

const withStores = withVlow([{
    store: TimerStore,
    keys: ['timers']
}]);


const scope = THINGSDB_SCOPE;
const itemKey = 'id';

const Timer = ({timers}) => {
    let location = useLocation();

    const timerId = getIdFromPath(location.pathname, TIMER_ROUTE);
    const selectedTimer = (timers[scope] || []).find(c => String(c[itemKey]) === timerId);

    React.useEffect(() => {
        TimerActions.getTimers(scope);
    }, []);

    return (
        isObjectEmpty(selectedTimer) ? null : (
            <Page item={selectedTimer} scope={scope} type="timer" itemKey={itemKey} />
        )
    );
};

Timer.propTypes = {
    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(Timer);