import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import TimerIcon from '@material-ui/icons/Timer';
import React from 'react';

import {AddTimerDialog} from '../ProceduresAndTimers';
import {Menu, orderByName} from '../Util';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';
import {TIMER_ROUTE} from '../../Constants/Routes';
import {TimerActions, TimerStore} from '../../Stores';

const withStores = withVlow([{
    store: TimerStore,
    keys: ['timers']
}]);

const useStyles = makeStyles(theme => ({
    buttonBase: {
        width: '100%',
        height: '100%',
        padding: 0,
        justifyContent: 'left',
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        '&:hover': {
            backgroundColor: '#303030',
        },
        text: 'italic',
    },
    icon: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        color: theme.palette.primary.main,
    },
}));

const scope = THINGSDB_SCOPE;
const TimersMenu = ({timers}) => {
    const classes = useStyles();
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
                addItem={
                    <Button color="primary" className={classes.buttonBase} onClick={handleClickAdd} >
                        <AddBoxIcon className={classes.icon} />
                    </Button>}
                homeRoute={TIMER_ROUTE}
                icon={<TimerIcon color="primary" />}
                itemKey="id"
                items={orderedTimers}
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