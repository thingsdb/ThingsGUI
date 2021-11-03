import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import { CancelTaskDialog } from '../TaskDialogs';


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
                <Button color="primary" onClick={handleClickOpen} variant="outlined">
                    {'Cancel'}
                </Button>
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