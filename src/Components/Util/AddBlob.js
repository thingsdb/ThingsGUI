import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Dropzone from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const AddBlob = ({cb}) => {
    const [blob, setBlob] = React.useState('');
    const [fileName, setFileName] = React.useState('');

    React.useEffect(() => {
        cb(blob);
    },
    [blob],
    );

    const handleDropzone = React.useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
            const binaryStr = reader.result;
            var encodedData = btoa(binaryStr);
            setBlob(encodedData);
            setFileName(acceptedFiles[0].name);
        };
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);

    return(
        <Grid container>
            <Grid item>
                <Dropzone onDrop={acceptedFiles => handleDropzone(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>
                                    {'Drag "n" drop some files here, or click to select files'}
                                </p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </Grid>
            <Grid item>
                <Collapse in={Boolean(blob)} timeout="auto" unmountOnExit>
                    <Typography variant="button" color="primary">
                        {fileName}
                    </Typography>
                </Collapse>
            </Grid>
        </Grid>
    );
};

AddBlob.propTypes = {
    cb: PropTypes.func.isRequired,
};

export default AddBlob;