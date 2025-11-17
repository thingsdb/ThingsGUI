import Collapse from '@mui/material/Collapse';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


const EditName = ({name, fn}: Props) => {
    const [newName, setNewName] = React.useState('');
    const [show, setShow] = React.useState(false);

    const handleClickOpenEdit = () => {
        setShow(true);
    };

    const handleClickCloseEdit = () => {
        setShow(false);
        setNewName('');
    };

    const handleChange = ({target}: React.ChangeEvent<any>) => {
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
                    color="secondary"
                    multiline
                    name="newName"
                    onChange={handleChange}
                    type="text"
                    value={newName}
                    variant="standard"
                    slotProps={{
                        htmlInput: {
                            style: {
                                fontSize: '2.125rem',
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontWeight: 400,
                                lineHeight: '1.235',
                                letterSpacing: '0.00735em'
                            }
                        },
                        inputLabel: {
                            shrink: true,
                        }
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

interface Props {
    name: string;
    fn: (name: string, newName: string) => void;
}