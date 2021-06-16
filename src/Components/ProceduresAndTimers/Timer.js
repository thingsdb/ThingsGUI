import {withVlow} from 'vlow';
import React from 'react';

import {ApplicationStore, TimerActions, TimerStore} from '../../Stores';
import {Page} from './Utils';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: TimerStore,
    keys: ['timers']
}]);


const scope = THINGSDB_SCOPE;
const Timer = ({match, timers}) => {

    React.useEffect(() => {
        TimerActions.getTimers(scope);
    }, []);

    return (
        <Page match={match} data={timers} scope={scope} type="timer" itemKey="id" />
    );
};

Timer.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(Timer);