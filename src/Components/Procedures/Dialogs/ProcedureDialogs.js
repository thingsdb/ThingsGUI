import PropTypes from 'prop-types';
import React from 'react';

import AddProcedureDialog from './AddProcedureDialog';
import EditProcedureDialog from './EditProcedureDialog';
import RunProcedureDialog from './RunProcedureDialog';
import ViewProcedureDialog from './ViewProcedureDialog';
import {EditProvider} from '../../Collections/CollectionsUtils';


const ProcedureDialogs = ({name, procedures, scope, open, onClose}) => {
    const {add, edit, run, view} = open;
    const handleCloseEdit = () => {
        onClose({edit: false});
    };

    const handleCloseAdd = () => {
        onClose({add: false});
    };

    const handleCloseRun = () => {
        onClose({run: false});
    };

    const handleCloseView = () => {
        onClose({view: false});
    };

    let selectedProcedure = name?procedures.find(i=>i.name==name):{};

    return (
        <React.Fragment>
            <ViewProcedureDialog open={view} onClose={handleCloseView} procedure={selectedProcedure||{}} />
            <AddProcedureDialog open={add} onClose={handleCloseAdd} scope={scope} />
            <EditProcedureDialog open={edit} onClose={handleCloseEdit} procedure={selectedProcedure||{}} scope={scope} />
            <EditProvider>
                <RunProcedureDialog open={run} onClose={handleCloseRun} procedure={selectedProcedure||{}} scope={scope} />
            </EditProvider>
        </React.Fragment>
    );
};

ProcedureDialogs.defaultProps = {
    name: '',
};

ProcedureDialogs.propTypes = {
    name: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.shape({
        add: PropTypes.bool,
        edit: PropTypes.bool,
        run: PropTypes.bool,
        view: PropTypes.bool,
    }).isRequired,
    procedures: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default ProcedureDialogs;
