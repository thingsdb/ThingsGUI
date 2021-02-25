import Collapse from '@material-ui/core/Collapse';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const EditName = ({name, fn}) => {
    const [newName, setNewName] = React.useState('');
    const [show, setShow] = React.useState(false);

    const handleClickOpenEdit = () => {
        setShow(true);
    };

    const handleClickCloseEdit = () => {
        setShow(false);
        setNewName('');
    };

    const handleChange = ({target}) => {
        const {value} = target;
        setNewName(value);
    };

    const handleClickSend = () => {
        fn(name, newName);
    };

    return (
        <React.Fragment>
            <Collapse in={!show} timeout="auto">
                <Typography variant="h4" color='primary' component='span'>
                    {newName||name}
                    <Button color="primary" onClick={handleClickOpenEdit}>
                        <EditIcon color="primary" />
                    </Button>
                </Typography>
            </Collapse>
            <Collapse in={show} timeout="auto" unmountOnExit>
                <TextField
                    name="newName"
                    type="text"
                    value={newName}
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
                <Button color="primary" onClick={handleClickSend}>
                    <SendIcon color="primary" />
                </Button>
                <Button color="primary" onClick={handleClickCloseEdit}>
                    <CancelIcon color="primary" />
                </Button>
            </Collapse>
        </React.Fragment>
    );
};

EditName.propTypes = {
    name: PropTypes.string.isRequired,
    fn: PropTypes.func.isRequired,
};

export default EditName;
