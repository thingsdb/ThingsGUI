/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Dropzone from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {EditActions, useEdit} from '../TreeActions/Context';


const AddBlob = ({identifier}) => {
    const [newBlob, setBlob] = React.useState('');
    const [fileName, setFileName] = React.useState('');

    const [editState, dispatch] = useEdit();
    const {blob} = editState;

    React.useEffect(() => {
        let f = fileName;
        if (fileName.includes('.')) {
            f = fileName.split('.')[0];
        }
        if (f != '' && newBlob != '') {
            EditActions.updateVal(dispatch, f, identifier);
            console.log(blob)
            EditActions.update(dispatch, {
                blob: {...blob, [f]: newBlob}
            });
        }
    },
    [fileName],
    );

    const handleDropzone = React.useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onabort = () => window.log('file reading was aborted');
        reader.onerror = () => window.log('file reading has failed');
        reader.onload = () => {
            const binaryStr = reader.result;
            var encodedData = btoa(binaryStr);
            setBlob(encodedData);
            setFileName(acceptedFiles[0].name);
        };
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
    }, []);

    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
                <Collapse in={Boolean(newBlob)} timeout="auto" unmountOnExit>
                    <Typography variant="button" color="primary">
                        {fileName}
                    </Typography>
                </Collapse>
            </Grid>
        </Grid>
    );
};

AddBlob.defaultProps = {
    identifier: null,
},

AddBlob.propTypes = {
    identifier: PropTypes.string
};


export default AddBlob;