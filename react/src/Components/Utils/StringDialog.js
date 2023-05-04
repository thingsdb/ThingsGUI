import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import OpenIcon from '@mui/icons-material/OpenInNew';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import {Copy, DownloadTextFile, SimpleModal} from '.';


const StringDialog = ({name, text}) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen= () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <SimpleModal
            button={
                <Button color="primary" onClick={handleOpen} >
                    <OpenIcon color="primary" />
                </Button>
            }
            title={`View ${name||'text'}`}
            open={open}
            onClose={handleClose}
            maxWidth="md"
            actionButtons={
                <React.Fragment>
                    <Copy text={text} />
                    <DownloadTextFile name={name} text={text} />
                </React.Fragment>
            }
        >
            <Grid
                container
                item
                xs={12}
                sx={{
                    padding: '16px',
                    border: '1px solid #525557',
                    position: 'relative',
                    borderRadius: '5px',
                    zIndex: 1,
                }}
            >
                <TextField
                    name="dialog_text"
                    type="text"
                    value={text}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                        disableUnderline: true,
                    }}
                    inputProps={{
                        style: {
                            fontFamily: 'monospace',
                            fontSize: 'body1.fontSize'
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    multiline
                    maxRows="40"
                    fullWidth
                />
            </Grid>
        </SimpleModal>

    );
};

StringDialog.defaultProps = {
    name: '',
};

StringDialog.propTypes = {
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export default StringDialog;
