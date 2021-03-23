import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {ProcedureDialogs} from '../../ProceduresAndTimers';
import {ProcedureActions, ProcedureStore} from '../../../Stores';
import {ProceduresTAG} from '../../../constants';
import Card from'./Card';


const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);

const tag = ProceduresTAG;

const Procedures = ({procedures, scope}) => {
    React.useEffect(() => {
        ProcedureActions.getProcedures(scope, tag);

    }, [scope]);


    const handleClickDelete = (n, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope,
            n,
            tag,
            ()=> cb()
        );
    };

    return (
        <Card
            onDelete={handleClickDelete}
            onDialogs={(name, open, handleClose) => <ProcedureDialogs name={name} open={open} onClose={handleClose} procedures={procedures[scope]||[]} scope={scope} />}
            list={procedures[scope] || []}
            tag={tag}
        />
    );
};

Procedures.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(Procedures);
