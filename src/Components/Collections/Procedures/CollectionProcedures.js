import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import React from 'react';
import {withVlow} from 'vlow';

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

    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        run: false,
    });


    const handleClickEdit = (i) => {
        setindex(i);
        setOpen({...open, edit: true});
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpen({...open, add: true});
    };

    const handleClickRun = (i) => {
        setindex(i);
        setOpen({...open, run: true});
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    const handleClickDelete = (i, cb, tag) => {
        console.log(i, procedures);
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

    return (
        <React.Fragment>
            <ChipsCard
                expand={false}
                items={procedures[scope]||[]}
                onAdd={handleClickAdd}
                onEdit={handleClickEdit}
                onRun={handleClickRun}
                onDelete={handleClickDelete}
                moreButtons={
                    <Chip
                        clickable
                        label="Edit"
                        onClick={handleClickEdit}
                        color="primary"
                        variant="outlined"
                    />
                }
                title="procedures"
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
