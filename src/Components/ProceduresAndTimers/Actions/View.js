import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Util';
import ViewProcedureDialog from '../ProcedureDialogs/ViewProcedureDialog';
import ViewTimerDialog from '../TimerDialogs/ViewTimerDialog';

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
        <ViewTimerDialog
            button={
                <CardButton onClick={handleClickOpen} title="View" />
            }
            open={open}
            onClose={handleClickClose}
            scope={scope}
            timer={item}
        />
    ));
};

View.propTypes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
};

export default View;