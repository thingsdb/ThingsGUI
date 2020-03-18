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

    const handleClickRun = () => {
        setindex(null);
        setOpen({...open, run: true});
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    const handleClickDelete = (i, cb) => {
        const item = procedures[i];
        ProcedureActions.deleteProcedure(
            scope,
            item.name,
            '27',
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
                onClick={handleClickEdit}
                onDelete={handleClickDelete}
                moreButtons={
                    <Chip
                        clickable
                        label="RUN"
                        onClick={handleClickRun}
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
