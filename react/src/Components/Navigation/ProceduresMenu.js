import {withVlow} from 'vlow';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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

const scope = THINGSDB_SCOPE;
const ProceduresMenu = ({procedures}) => {
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
                homeRoute={PROCEDURE_ROUTE}
                icon={<PlayArrowIcon color="primary" />}
                itemKey="name"
                items={orderedProcedures}
                onAdd={handleClickAdd}
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