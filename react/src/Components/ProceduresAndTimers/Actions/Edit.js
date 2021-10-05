import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Utils';
import EditProcedureDialog from '../ProcedureDialogs/EditProcedureDialog';
import EditTimerDialog from '../TimerDialogs/EditTimerDialog';


const Edit = ({item, scope, type}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        type === 'procedure' ? (
            <EditProcedureDialog
                button={
                    <CardButton onClick={handleClickOpen} title="Edit" />
                }
                open={open}
                onClose={handleClickClose}
                procedure={item}
                scope={scope}
            />
        ) : (
            <EditTimerDialog
                button={
                    <CardButton onClick={handleClickOpen} title="Edit" />
                }
                open={open}
                onClose={handleClickClose}
                timer={item}
                scope={scope}
            />
        )
    );
};

Edit.propTypes = {
    item: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default Edit;