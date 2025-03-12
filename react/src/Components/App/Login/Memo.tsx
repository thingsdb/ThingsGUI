import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { SimpleModal } from '../../Utils';
import {ApplicationActions} from '../../../Stores';
import {LoginTAG} from '../../../Constants/Tags';

const tag = LoginTAG;

const Memo = ({connection}) => {
    const [memo, setMemo] = React.useState(connection.memo);
    const [open, setOpen] = React.useState(false);

    const handleChange = ({target}) => {
        const {value} = target;
        setMemo(value);
    };

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleClickSave = () => {
        ApplicationActions.editCachedConn({name: connection.name, memo: memo}, tag, handleOpen);
    };

    return (
        <React.Fragment>
            <Tooltip disableFocusListener disableTouchListener title={connection.memo}>
                <IconButton color="primary" onClick={handleOpen}>
                    <MessageIcon color="primary" />
                </IconButton>
            </Tooltip>
            <SimpleModal
                title={`Description of ${connection.name}`}
                onOk={handleClickSave}
                open={open}
                onClose={handleOpen}
            >
                <TextField
                    autoFocus
                    fullWidth
                    id="memo"
                    label="Message"
                    margin="dense"
                    multiline
                    onChange={handleChange}
                    spellCheck={false}
                    type="text"
                    value={memo}
                    variant="standard"
                />
            </SimpleModal>
        </React.Fragment>
    );
};

Memo.propTypes = {
    connection: PropTypes.object.isRequired,
};

export default Memo;