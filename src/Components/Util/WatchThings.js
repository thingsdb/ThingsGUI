import PropTypes from 'prop-types';
import React from 'react';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import {EventStore, EventActions} from '../../Stores/BaseStore';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchIds']
}]);

const useStyles = makeStyles(theme => ({
    fabRed: {
        backgroundColor: theme.palette.primary.red,
        opacity: '0.6',
        '&:hover': {
            backgroundColor: theme.palette.primary.red,
            opacity: '0.4',
        },
    },
    fabGreen: {
        backgroundColor: theme.palette.primary.green,
        '&:hover': {
            backgroundColor: theme.palette.primary.green,
            opacity: '0.7',
        },
    },
    red: {
        color: theme.palette.primary.red,
        opacity: '0.6',
        '&:hover': {
            backgroundColor: theme.palette.primary.red,
            opacity: '0.4',
        },
    },
    green: {
        color: theme.palette.primary.green,
        '&:hover': {
            backgroundColor: theme.palette.primary.green,
            opacity: '0.7',
        },
    },
}));

const WatchThings = ({buttonIsFab, scope, thingId, watchIds}) => {
    const classes = useStyles();

    // stringify thingId
    const onWatch = watchIds.hasOwnProperty(scope) && watchIds[scope].includes(`${thingId}`);

    const handleWatcher = () => {
        if (!onWatch) {
            EventActions.watch(
                scope,
                thingId
            );
        } else {
            EventActions.unwatch(
                scope,
                thingId
            );
        }
    };

    return (
        <React.Fragment>
            <Tooltip disableFocusListener disableTouchListener title={onWatch ? 'Turn watching off' : 'Turn watching on'}>
                {buttonIsFab ? (
                    <Fab className={onWatch ? classes.fabGreen:classes.fabRed} onClick={handleWatcher} >
                        {onWatch ? <ExploreIcon fontSize="large" /> : <ExploreOffIcon fontSize="large" />}
                    </Fab>
                ): (
                    onWatch ? <ExploreIcon className={classes.green} /> : <ExploreOffIcon className={classes.red} />
                )}
            </Tooltip>
        </React.Fragment>
    );
};

WatchThings.propTypes = {
    buttonIsFab: PropTypes.bool.isRequired,
    scope: PropTypes.string.isRequired,
    thingId: PropTypes.number.isRequired,

    // Event properties
    watchIds: EventStore.types.watchIds.isRequired,
};

export default withStores(WatchThings);