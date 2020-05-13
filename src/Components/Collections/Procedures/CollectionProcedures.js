import {withVlow} from 'vlow';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ProcedureDialogs} from '../../Procedures';
import {ProcedureActions, ProcedureStore} from '../../../Stores';
import {ChipsCard} from '../../Util';
import {CollectionProceduresTAG} from '../../../constants';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);

const tag = CollectionProceduresTAG;

const CollectionProcedures = ({procedures, scope}) => {
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        ProcedureActions.getProcedures(scope, tag);
    };


    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        run: false,
        view: false,
    });


    const handleClickEdit = (n) => () => {
        setName(n);
        setOpen({...open, edit: true});
    };

    const handleClickAdd = () => {
        setName('');
        setOpen({...open, add: true});
    };

    const handleClickRun = (n) => () => {
        setName(n);
        setOpen({...open, run: true});
    };

    const handleClickView = (n) => () => {
        setName(n);
        setOpen({...open, view: true});
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    const handleClickDelete = (n, cb, tag) => {
        ProcedureActions.deleteProcedure(
            scope,
            n,
            tag,
            ()=> {
                cb();
            }
        );
    };

    const buttons = (n)=>([
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: handleClickView(n),
        },
        {
            icon: <RunIcon fontSize="small" />,
            onClick: handleClickRun(n),
        },
        {
            icon:  <EditIcon fontSize="small" />,
            onClick: handleClickEdit(n),
        },
    ]);

    console.log(procedures[scope])

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={procedures[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title="procedures"
                warnExpression={i=>i.with_side_effects}
            />
            <ProcedureDialogs name={name} open={open} onClose={handleClose} procedures={procedures[scope]||[]} scope={scope} />
        </React.Fragment>
    );
};

CollectionProcedures.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(CollectionProcedures);
