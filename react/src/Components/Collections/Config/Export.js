import { amber } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Copy, DownloadTextFile, ErrorMsg, SimpleModal } from '../../Utils';
import { CollectionActions } from '../../../Stores';
import { COLLECTION_SCOPE } from '../../../Constants/Scopes';
import { ExportCollectionTAG } from '../../../Constants/Tags';
import { EXPORT_QUERY } from '../../../TiQueries/Queries';


const StyledGrid = styled(Grid)(({ theme }) => ({
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    border: '1px solid #525557',
    position: 'relative',
    borderRadius: '5px',
    zIndex: 1,
}));

const Label = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '-10px',
    left: '10px',
    height: '20px',
    border: 'None',
    textAlign: 'center',
    paddingLeft: '3px',
    paddingRight: '3px',
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
}));

const tag = ExportCollectionTAG;

const Export = ({collection}) => {
    // to prevent update of name to undefined, after it is deleted.
    const [name] = React.useState(collection.name); // eslint-disable-line
    const [show, setShow] = React.useState(false);
    const [script, setScript] = React.useState('');

    const handleClickOpen = () => {
        CollectionActions.query(
            `${COLLECTION_SCOPE}:${collection.name}`, EXPORT_QUERY, tag, setScript
        );
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'View setup script'}
                </Button>
            }
            title={`View the setup script of ${name}.`}
            open={show}
            onClose={handleClickClose}
            maxWidth="md"
            actionButtons={
                <React.Fragment>
                    <Copy text={script} />
                    <DownloadTextFile name={name} text={script} />
                </React.Fragment>
            }
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                    <Typography variant="body2">
                        {'This setup script includes all enums, types and procedures.'}
                    </Typography>
                    <Typography variant="subtitle2" component="span" sx={{color: amber[700]}}>
                        {'Note: '}
                        <Box component="span" sx={{ fontStyle: 'italic' }}>
                            {'export() '}
                        </Box>
                        {'is an experimental function and may change in the future.'}
                    </Typography>
                </Grid>
                <StyledGrid container item xs={12}>
                    <Label variant="caption">
                        {'script'}
                    </Label>
                    <TextField
                        name="script"
                        type="script"
                        value={script}
                        variant="standard"
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                        }}
                        inputProps={{
                            style: {
                                fontFamily: 'monospace',
                                fontSize: 'caption.fontSize',
                                tabSize: 4,
                            },
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        multiline
                        maxRows="40"
                        fullWidth
                        sx={{margin: '8px'}}
                    />
                </StyledGrid>
            </Grid>
        </SimpleModal>
    );
};

Export.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default Export;