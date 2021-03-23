import {withVlow} from 'vlow';
import React from 'react';

import {ApplicationStore, TimerActions, TimerStore} from '../../Stores';
import Page from './Page';

const withStores = withVlow([{
    store: ApplicationStore,
    keys: ['match']
}, {
    store: TimerStore,
    keys: ['timers']
}]);


const scope = '@thingsdb';
const Timer = ({match, timers}) => {

    React.useEffect(() => {
        TimerActions.getTimers(scope);
    }, []);

    return (
        <Page match={match} list={timers} scope={scope} type="timer" />
    );
};

Timer.propTypes = {
    /* Application properties */
    match: ApplicationStore.types.match.isRequired,
    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(Timer);