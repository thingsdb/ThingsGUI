import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {TimerDialogs} from '../../ProceduresAndTimers';
import {TimerActions, TimerStore} from '../../../Stores';
import {TimersTAG} from '../../../constants';
import Card from'./Card';


const withStores = withVlow([{
    store: TimerStore,
    keys: ['timers']
}]);

const tag = TimersTAG;

const Timers = ({timers, scope}) => {
    React.useEffect(() => {
        TimerActions.getTimers(scope, tag);

    }, [scope]);


    const handleClickDelete = (id, cb, tag) => {
        TimerActions.deleteTimer(
            scope,
            id,
            tag,
            ()=> cb()
        );
    };

    return (
        <Card
            itemKey={'id'}
            onDelete={handleClickDelete}
            onDialogs={(name, open, handleClose) => <TimerDialogs id={name} open={open} onClose={handleClose} timers={timers[scope]||[]} scope={scope} />}
            list={timers[scope] || []}
            tag={tag}
        />
    );
};

Timers.propTypes = {
    scope: PropTypes.string.isRequired,

    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(Timers);
