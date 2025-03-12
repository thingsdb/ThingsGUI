/*eslint-disable react/jsx-props-no-spreading*/
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {EditActions, useEdit} from '../Context';
import {AddFile, DownloadBlob} from '../..';


const AddBlob = ({
    identifier = null,
    init = null,
    parent
}: Props) => {
    const [fileName, setFileName] = React.useState('');

    const [editState, dispatch] = useEdit();
    const {blob, val} = editState;

    React.useEffect(()=>{
        setFileName(!val ? '' : identifier === null ? val : val[identifier] || '');
    }, [identifier, val]);

    const handleUpdate = React.useCallback((f, b) =>  {
        f = f.replaceAll('.', '_');
        f = f.replaceAll('-', '_');
        f = f.replaceAll(/\s/g, '_');
        if (f != '' && b != '') {
            EditActions.update(dispatch, 'val', f, identifier, parent);
            dispatch(() => ({ blob: { ...blob, [f]: b } }));
        }
    }, [blob, dispatch, identifier, parent]);

    return(
        <Grid container>
            <AddFile init={fileName} onChange={handleUpdate} />
            {init &&
                <Grid container size={4} spacing={1} justifyContent="flex-end">
                    <Grid container size={12} justifyContent="flex-end">
                        <DownloadBlob val={init} isImg />
                    </Grid>
                    <Grid container size={12} justifyContent="flex-end">
                        <Typography variant="caption">
                            {'Download blob that is currently stored.'}
                        </Typography>
                    </Grid>
                </Grid>
            }
        </Grid>
    );
};

AddBlob.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.string,
    parent: PropTypes.string.isRequired,
};


export default AddBlob;

interface Props {
    identifier: string | number;
    init: string;
    parent: string;
}
