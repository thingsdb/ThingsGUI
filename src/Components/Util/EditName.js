/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const EditName = ({name, fn}) => {
    const [newName, setNewName] = React.useState('');
    const [show, setShow] = React.useState(false);

    const handleClickOpenEdit = () => {
        setShow(true)
    };

    const handleClickCloseEdit = () => {
        setShow(false)
        setNewName('');
    };

    const handleChange = ({target}) => {
        const {value} = target;
        setNewName(value);
    };

    const handleClickSend = () => {
        fn(name, newName)
    };

    return (
        <React.Fragment>
            <Collapse in={!show} timeout="auto">
                <Typography variant="h4" color='primary' component='span'>
                    {newName||name}
                    <IconButton onClick={handleClickOpenEdit}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Typography>
            </Collapse>
            <Collapse in={show} timeout="auto" unmountOnExit>
                <TextField
                    name="newName"
                    // label="Name"
                    type="text"
                    value={newName}
                    // fullWidth
                    multiline
                    onChange={handleChange}
                    color="secondary"
                    inputProps={{
                        style: {
                            fontSize: '2.125rem',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            fontWeight: 400,
                            lineHeight: '1.235',
                            letterSpacing: '0.00735em'
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <IconButton onClick={handleClickSend}>
                    <SendIcon color="primary" />
                </IconButton>
                <IconButton onClick={handleClickCloseEdit}>
                    <CancelIcon color="primary" />
                </IconButton>
            </Collapse>
        </React.Fragment>
    );
};

EditName.propTypes = {
    name: PropTypes.string.isRequired,
    fn: PropTypes.func.isRequired,
};

export default EditName;
