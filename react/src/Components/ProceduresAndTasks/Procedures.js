import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {ProcedureDialogs} from '.';
import {ProcedureActions, ProcedureStore} from '../../Stores';
import {ProceduresTAG} from '../../Constants/Tags';
import {Card} from'./Utils';
import {HarmonicCardHeader} from '../Utils';


const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);

const tag = ProceduresTAG;

const Procedures = ({buttonsView, dialogsView, onCallback, procedures, scope}) => {
    const [identifier, setIdentifier] = React.useState(null);
    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        run: false,
        view: false,
    });

    const handleRefreshProcedures = React.useCallback(() => {
        ProcedureActions.getProcedures(scope, ProceduresTAG);
    }, [scope]);

    React.useEffect(() => {
        handleRefreshProcedures();
    }, [handleRefreshProcedures]);

    const handleClick = (type, ident) => () => {
        setIdentifier(ident);
        setOpen({...open, [type]: true});
        onCallback(type, (procedures[scope] || []).find(i=>i.name == identifier));
    };

    const handleClickAdd = () => {
        setIdentifier(null);
        setOpen({...open, add: true});
        onCallback('add', null);
    };

    const handleClickDelete = (n, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope,
            n,
            tag,
            ()=> cb()
        );
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    return (
        <HarmonicCardHeader title="PROCEDURES" onRefresh={handleRefreshProcedures} unmountOnExit>
            <Card
                buttonsView={buttonsView}
                itemKey={'name'}
                list={procedures[scope] || []}
                onAdd={handleClickAdd}
                onClick={handleClick}
                onDelete={handleClickDelete}
                tag={tag}
            />
            <ProcedureDialogs dialogsView={dialogsView} name={identifier} open={open} onClose={handleClose} procedures={procedures[scope]||[]} scope={scope} />
        </HarmonicCardHeader >
    );
};

Procedures.defaultProps = {
    onCallback: () => null,
};

Procedures.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    dialogsView: PropTypes.object.isRequired,
    onCallback: PropTypes.func,
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedures);
