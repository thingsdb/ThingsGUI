import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React from 'react';

import {AddProcedureDialog} from '../ProceduresAndTimers';
import {Menu, orderByName} from '../Util';
import {PROCEDURE_ROUTE} from '../../Constants/Routes';
import {ProcedureActions, ProcedureStore} from '../../Stores';
import {THINGSDB_SCOPE} from '../../Constants/Scopes';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
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
const ProceduresMenu = ({procedures}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope);
    }, []);

    const handleRefresh = () => {
        ProcedureActions.getProcedures(scope);
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const orderedProcedures = orderByName(procedures[scope]||[]);

    return (
        <React.Fragment>
            <Menu
                addItem={
                    <Button color="primary" className={classes.buttonBase} onClick={handleClickAdd} >
                        <AddBoxIcon className={classes.icon} />
                    </Button>}
                homeRoute={PROCEDURE_ROUTE}
                icon={<PlayArrowIcon color="primary" />}
                itemKey="name"
                items={orderedProcedures}
                onRefresh={handleRefresh}
                title="procedures"
            />
            <AddProcedureDialog open={open} onClose={handleClose} scope={scope} />
        </React.Fragment>
    );
};

ProceduresMenu.propTypes = {

    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(ProceduresMenu);