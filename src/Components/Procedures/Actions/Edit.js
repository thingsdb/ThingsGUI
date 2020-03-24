import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Util';
import EditProcedureDialog from '../Dialogs/EditProcedureDialog';


const Edit = ({procedure, scope}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <EditProcedureDialog
            button={
                <CardButton onClick={handleClickOpen} title="Edit" />
            }
            open={open}
            onClose={handleClickClose}
            procedure={procedure}
            scope={scope}
        />
    );
};

Edit.propTypes = {
    procedure: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default Edit;