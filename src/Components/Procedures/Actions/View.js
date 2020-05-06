import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Util';
import ViewProcedureDialog from '../Dialogs/ViewProcedureDialog';


const View = ({procedure}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <ViewProcedureDialog
            button={
                <CardButton onClick={handleClickOpen} title="View" />
            }
            open={open}
            onClose={handleClickClose}
            procedure={procedure}
        />
    );
};

View.propTypes = {
    procedure: PropTypes.object.isRequired,
};

export default View;