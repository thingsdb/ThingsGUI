/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import OpenIcon from '@material-ui/icons/OpenInNewOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {Copy, DownloadTextFile, SimpleModal} from '../Util';


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
    const reference = React.useRef(null);
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
                <Button onClick={handleOpen} >
                    <OpenIcon color="primary" />
                </Button>
            }
            title={`View ${name||'text'}`}
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            actionButtons={
                <React.Fragment>
                    <Copy reference={reference} />
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
                    inputRef={reference}
                    multiline
                    rowsMax="40"
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
