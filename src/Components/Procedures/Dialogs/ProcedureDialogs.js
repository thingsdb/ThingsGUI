import PropTypes from 'prop-types';
import React from 'react';

import AddProcedureDialog from './AddProcedureDialog';
import EditProcedureDialog from './EditProcedureDialog';
import RunProcedureDialog from './RunProcedureDialog';
import {EditProvider} from '../../Collections/CollectionsUtils';


const ProcedureDialogs = ({index, procedures, scope, open, onClose}) => {
    const {add, edit, run} = open;
    const handleCloseEdit = () => {
        onClose({edit: false});
    };

    const handleCloseAdd = () => {
        onClose({add: false});
    };


    const handleCloseRun = () => {
        onClose({run: false});
    };

    return (
        <React.Fragment>
            <AddProcedureDialog open={add} onClose={handleCloseAdd} scope={scope} />
            <EditProcedureDialog open={edit} onClose={handleCloseEdit} procedure={index!==null?procedures[index]:{}} scope={scope} />
            <EditProvider>
                <RunProcedureDialog open={run} onClose={handleCloseRun} procedure={index!==null?procedures[index]:{}} scope={scope} />
            </EditProvider>
        </React.Fragment>
    );
};

ProcedureDialogs.defaultProps = {
    index: null,
};

ProcedureDialogs.propTypes = {
    index: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.shape({
        add: PropTypes.bool,
        edit: PropTypes.bool,
        run: PropTypes.bool,
    }).isRequired,
    procedures: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default ProcedureDialogs;
