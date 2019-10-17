import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExploreIcon from '@material-ui/icons/Explore';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';
import Tooltip from '@material-ui/core/Tooltip';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import {EventStore, EventActions} from '../../Stores/BaseStore';

const withStores = withVlow([{
    store: EventStore,
    keys: ['watchIds']
}]);

const useStyles = makeStyles(theme => ({
    red: {
        color: theme.palette.primary.red,
    },
    green: {
        color: theme.palette.primary.green,
    },
}));

const WatchThings = ({scope, thingId, watchIds}) => {
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
                <ButtonBase onClick={handleWatcher} >
                    {onWatch ? <ExploreIcon className={classes.green} /> : <ExploreOffIcon className={classes.red} />}
                </ButtonBase>
            </Tooltip>
        </React.Fragment>
    );
};

WatchThings.propTypes = {
    scope: PropTypes.string.isRequired,
    thingId: PropTypes.number.isRequired,

    // Event properties
    watchIds: EventStore.types.watchIds.isRequired,
};

export default withStores(WatchThings);