import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import React from 'react';

import AddProcedureDialog from './AddProcedureDialog';
import EditProcedureDialog from './EditProcedureDialog';
import RunProcedureDialog from './RunProcedureDialog';
import {EditProvider} from '../CollectionsUtils';
import {ProcedureActions} from '../../../Stores';
import {ChipsCard} from '../../Util';

const tag = '6';

const CollectionProcedures = ({scope}) => {
    const [index, setindex] = React.useState(null);
    const [procedures, setProcedures] = React.useState([]);

    const handleProcedures = (p) => {
        setProcedures(p);
    };

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope, tag, handleProcedures);

    }, [scope]);

    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openRun, setOpenRun] = React.useState(false);


    const handleClickEdit = (i) => {
        setindex(i);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpenAdd(true);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleClickRun = () => {
        setindex(null);
        setOpenRun(true);
    };
    const handleCloseRun = () => {
        setOpenRun(false);
    };

    const handleClickDelete = (i, cb) => {
        const item = procedures[i];
        ProcedureActions.deleteProcedure(
            scope,
            item.name,
            '27',
            (p)=> {
                cb();
                handleProcedures(p);
            }
        );
    };

    return (
        <React.Fragment>
            <ChipsCard
                expand={false}
                items={procedures}
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
            <AddProcedureDialog open={openAdd} onClose={handleCloseAdd} scope={scope} cb={handleProcedures} />
            <EditProcedureDialog open={openEdit} onClose={handleCloseEdit} procedure={index!==null?procedures[index]:{}} scope={scope} cb={handleProcedures} />
            <EditProvider>
                <RunProcedureDialog open={openRun} onClose={handleCloseRun} procedures={procedures} scope={scope} />
            </EditProvider>
        </React.Fragment>
    );
};

CollectionProcedures.propTypes = {
    scope: PropTypes.string.isRequired,
};

export default CollectionProcedures;
