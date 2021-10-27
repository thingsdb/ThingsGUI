import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Utils';
import ViewProcedureDialog from '../ProcedureDialogs/ViewProcedureDialog';
import ViewTaskDialog from '../TaskDialogs/ViewTaskDialog';

const View = ({item, scope, type}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return( type === 'procedure' ? (
        <ViewProcedureDialog
            button={
                <CardButton onClick={handleClickOpen} title="View" />
            }
            open={open}
            onClose={handleClickClose}
            procedure={item}
        />
    ) : (
        <ViewTaskDialog
            button={
                <CardButton onClick={handleClickOpen} title="View" />
            }
            open={open}
            onClose={handleClickClose}
            scope={scope}
            taskId={item}
        />
    ));
};

View.propTypes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
};

export default View;