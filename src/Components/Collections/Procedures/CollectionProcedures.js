import {withVlow} from 'vlow';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ProcedureDialogs} from '../../Procedures';
import {ProcedureActions, ProcedureStore} from '../../../Stores';
import {ChipsCard} from '../../Util';


const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);

const tag = '6';

const CollectionProcedures = ({procedures, scope}) => {
    const [index, setindex] = React.useState(null);

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


    const handleClickEdit = (i) => () => {
        setindex(i);
        setOpen({...open, edit: true});
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpen({...open, add: true});
    };

    const handleClickRun = (i) => () => {
        setindex(i);
        setOpen({...open, run: true});
    };

    const handleClickView = (i) => () => {
        setindex(i);
        setOpen({...open, view: true});
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    const handleClickDelete = (i, cb, tag) => {
        const item = procedures[scope][i];
        ProcedureActions.deleteProcedure(
            scope,
            item.name,
            tag,
            ()=> {
                cb();
            }
        );
    };

    const buttons = (index)=>([
        {
            icon: <RunIcon fontSize="small" />,
            onClick: handleClickRun(index),
        },
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: handleClickView(index),
        },
        {
            icon:  <EditIcon fontSize="small" />,
            onClick: handleClickEdit(index),
        },
    ]);

    // const buttons = (index)=>([
    //     {
    //         icon: <RunIcon fontSize="small" />,
    //         onClick: handleClickRun(index),
    //     },
    //     {
    //         icon: <ViewIcon fontSize="small" />,
    //         onClick: handleClickView(index),
    //     },
    //     {
    //         icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
    //         onClick: handleClickEdit(index),
    //     },
    // ]);

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
            <ProcedureDialogs index={index} open={open} onClose={handleClose} procedures={procedures[scope]||[]} scope={scope} />
        </React.Fragment>
    );
};

CollectionProcedures.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(CollectionProcedures);
