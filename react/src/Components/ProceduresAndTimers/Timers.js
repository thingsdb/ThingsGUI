import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import { TimerDialogs } from '.';
import { TimerActions, TimerStore } from '../../Stores';
import { TimersTAG } from '../../Constants/Tags';
import { Card } from'./Utils';
import { nextRunFn } from '../Utils';
import { HarmonicCardHeader } from '../Utils';


const withStores = withVlow([{
    store: TimerStore,
    keys: ['timers']
}]);

const header = [
    {ky: 'id', label: 'ID'},
    {ky: 'doc', label: 'Documentation', fn: (d) => d.length > 20 ? d.slice(0, 20) + '...' : d},
    {ky: 'next_run', label: 'Next run', fn: nextRunFn},
];

const tag = TimersTAG;

const Timers = ({buttonsView, dialogsView, onCallback, timers, scope}) => {
    const [identifier, setIdentifier] = React.useState(null);
    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        run: false,
        view: false,
    });

    const handleRefreshTimers = React.useCallback(() => {
        TimerActions.getTimers(scope, TimersTAG);
    }, [scope]);

    React.useEffect(() => {
        handleRefreshTimers();
    }, [handleRefreshTimers]);

    const handleClick = (type, ident) => () => {
        setIdentifier(ident);
        setOpen({...open, [type]: true});
        onCallback(type, (timers[scope] || []).find(i=>i.id == identifier));
    };

    const handleClickAdd = () => {
        setIdentifier(null);
        setOpen({...open, add: true});
        onCallback('add', null);
    };

    const handleClickDelete = (id, cb, tag) => {
        TimerActions.deleteTimer(
            scope,
            id,
            tag,
            ()=> cb()
        );
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    return (
        <HarmonicCardHeader title="TIMERS" onRefresh={handleRefreshTimers} unmountOnExit>
            <Card
                buttonsView={buttonsView}
                header={header}
                itemKey={'id'}
                onDelete={handleClickDelete}
                onAdd={handleClickAdd}
                onClick={handleClick}
                list={timers[scope] || []}
                tag={tag}
            />
            <TimerDialogs dialogsView={dialogsView} id={identifier} open={open} onClose={handleClose} timers={timers[scope]||[]} scope={scope} />
        </HarmonicCardHeader>
    );
};

Timers.defaultProps = {
    onCallback: () => null,
};

Timers.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    dialogsView: PropTypes.object.isRequired,
    onCallback: PropTypes.func,
    scope: PropTypes.string.isRequired,

    /* timers properties */
    timers: TimerStore.types.timers.isRequired,
};

export default withStores(Timers);
