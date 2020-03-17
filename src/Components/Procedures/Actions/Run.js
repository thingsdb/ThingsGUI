import PropTypes from 'prop-types';
import React from 'react';

import { CardButton } from '../../Util';
import RunProcedureDialog from '../Dialogs/RunProcedureDialog';
import {EditProvider} from '../../Collections/CollectionsUtils';



const Run = ({procedure, scope}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <EditProvider>
            <RunProcedureDialog
                button={
                    <CardButton onClick={handleClickOpen} title="Run" />
                }
                open={open}
                onClose={handleClickClose}
                procedure={procedure}
                scope={scope}
            />
        </EditProvider>
    );
};

Run.propTypes = {
    procedure: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default Run;