/*eslint-disable react/jsx-props-no-spreading*/
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Dropzone from 'react-dropzone';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {EditActions, useEdit} from '../Context';
import {DownloadBlob} from '../..';

const getColor = (theme, isFocused, isDragAccept, isDragReject) => {
    if (isDragAccept) {
        return theme.palette.primary.main;
    }
    if (isDragReject) {
        return '#ff1744';
    }
    if (isFocused) {
        return theme.palette.primary.main;
    }
    return '#eeeeee';
};

const Container = styled('div', {shouldForwardProp: (prop) => prop !== 'isFocused' && prop !== 'isDragAccept' && prop !== 'isDragReject' })(
    ({ theme, isFocused, isDragAccept, isDragReject }) => ({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: '2px',
        borderRadius: '2px',
        borderColor: getColor(theme, isFocused, isDragAccept, isDragReject),
        borderStyle: 'dashed',
        backgroundColor: theme.palette.background.primary,
        color: theme.palette.text.main,
        outline: 'none',
        transition: 'border .24s ease-in-out',
    })
);


const AddBlob = ({identifier, init, parent}) => {
    const [fileName, setFileName] = React.useState('');

    const [editState, dispatch] = useEdit();
    const {blob, val} = editState;

    React.useEffect(()=>{
        setFileName(!val ? '' : identifier === null ? val : val[identifier] || '');
    }, [identifier, val]);

    const handleUpdate = React.useCallback((f, b) =>  {
        f = f.replaceAll('.', '_');
        f = f.replaceAll('-', '_');
        if (f != '' && b != '') {
            EditActions.update(dispatch, 'val', f, identifier, parent);
            dispatch(() => ({ blob: { ...blob, [f]: b } }));
        }
    }, [blob, dispatch, identifier, parent]);

    const handleDropzone = React.useCallback((acceptedFiles) => {
        console.log(acceptedFiles)
        const reader = new FileReader();
        reader.onabort = () => window.log('file reading was aborted');
        reader.onerror = () => window.log('file reading has failed');
        reader.onload = () => {
            const binaryStr = reader.result;
            var encodedData = btoa(binaryStr);
            const filename = acceptedFiles[0].name;
            setFileName(filename);
            handleUpdate(filename, encodedData);
        };
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, [handleUpdate]);

    return(
        <Grid container>
            <Grid item xs={8}>
                <Grid item xs={12}>
                    <Dropzone onDrop={acceptedFiles => handleDropzone(acceptedFiles)}>
                        {({
                            getRootProps,
                            getInputProps,
                            isFocused,
                            isDragAccept,
                            isDragReject
                        }) => (
                            <section>
                                <Container {...getRootProps()} isFocused={isFocused} isDragAccept={isDragAccept} isDragReject={isDragReject}>
                                    <input {...getInputProps()} />
                                    <p>
                                        {'Drag "n" drop a file here, or click to select'}
                                    </p>
                                </Container>
                            </section>
                        )}
                    </Dropzone>
                </Grid>
                <Grid item xs={12}>
                    <Collapse in={Boolean(fileName)} timeout="auto" unmountOnExit>
                        <Typography variant="button" color="primary">
                            {fileName}
                        </Typography>
                    </Collapse>
                </Grid>
            </Grid>
            {init &&
                <Grid container item xs={4} spacing={1} justifyContent="flex-end">
                    <Grid container item xs={12} justifyContent="flex-end">
                        <DownloadBlob val={init} isImg />
                    </Grid>
                    <Grid container item xs={12} justifyContent="flex-end">
                        <Typography variant="caption">
                            {'Download blob that is currently stored.'}
                        </Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    );
};

AddBlob.defaultProps = {
    identifier: null,
    init: null
},

AddBlob.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.string,
    parent: PropTypes.string.isRequired,
};


export default AddBlob;