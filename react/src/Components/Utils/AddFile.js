/*eslint-disable react/jsx-props-no-spreading*/
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Dropzone from 'react-dropzone';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


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


const AddFile = ({
    init = null,
    onChange,
}) => {
    const [fileName, setFileName] = React.useState(init);

    const handleDropzone = React.useCallback((acceptedFiles) => {
        const reader = new FileReader();
        reader.onabort = () => window.console.log('file reading was aborted');
        reader.onerror = () => window.console.log('file reading has failed');
        reader.onload = () => {
            const binaryStr = reader.result;
            var encodedData = btoa(binaryStr);
            const filename = acceptedFiles[0].name;
            setFileName(filename);
            onChange(filename, encodedData);
        };
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, [onChange]);

    return(
        <Grid size={8}>
            <Grid size={12}>
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
            <Grid size={12}>
                <Collapse in={Boolean(fileName)} timeout="auto" unmountOnExit>
                    <Typography variant="button" color="primary">
                        {fileName}
                    </Typography>
                </Collapse>
            </Grid>
        </Grid>
    );
};

AddFile.propTypes = {
    init: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};


export default AddFile;