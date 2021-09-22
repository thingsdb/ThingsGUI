import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import OpenIcon from '@material-ui/icons/OpenInNew';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import {Copy, DownloadTextFile, SimpleModal} from '.';


const useStyles = makeStyles(theme => ({
    border: {
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        border: '1px solid #525557',
        position: 'relative',
        borderRadius: '5px',
        zIndex: 1,
    },
    someMargin: {
        margin: theme.spacing(1)
    },
}));


const StringDialog = ({name, text}) => {
    const classes = useStyles();
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
            <Grid className={classes.border} container item xs={12}>
                <TextField
                    className={classes.someMargin}
                    name="dialog_text"
                    type="text"
                    value={text}
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
