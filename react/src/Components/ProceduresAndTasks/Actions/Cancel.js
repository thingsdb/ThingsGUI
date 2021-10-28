import PropTypes from 'prop-types';
import React from 'react';

import { CancelTaskDialog } from '../TaskDialogs';
import { CardButton } from '../../Utils';


const Cancel = ({item, scope}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return(
        <CancelTaskDialog
            button={
                <CardButton onClick={handleClickOpen} title="Cancel" />
            }
            open={open}
            onClose={handleClickClose}
            scope={scope}
            task={item}
        />
    );
};

Cancel.propTypes = {
    item: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default Cancel;