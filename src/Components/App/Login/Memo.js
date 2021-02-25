import Button from '@material-ui/core/Button';
import MessageIcon from '@material-ui/icons/Message';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

import { SimpleModal } from '../../Util';
import {ApplicationActions} from '../../../Stores';
import {LoginTAG} from '../../../constants';

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
                <Button color="primary" onClick={handleOpen}>
                    <MessageIcon color="primary" />
                </Button>
            </Tooltip>
            <SimpleModal
                title={`Description of ${connection.name}`}
                onOk={handleClickSave}
                open={open}
                onClose={handleOpen}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="memo"
                    label="Message"
                    type="text"
                    value={memo}
                    spellCheck={false}
                    onChange={handleChange}
                    fullWidth
                    multiline

                />
            </SimpleModal>
        </React.Fragment>
    );
};

Memo.propTypes = {
    connection: PropTypes.object.isRequired,
};

export default Memo;