/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EditActions, useEdit } from '../Context';


const AddRegex = ({identifier, init, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    React.useEffect(()=>{
        if (init) {
            EditActions.update(dispatch, 'val', init, identifier, parent);
        }
    }, []);

    const handleOnChange = ({target}) => {
        const {value} = target;
        EditActions.update(dispatch, 'val', `/${value}/`, identifier, parent); // TODO query
    };
    const v = !val ? '' : identifier === null ? val : val[identifier] || '';

    return(
        <Grid container spacing={1} sx={{paddingTop: '8px', marginTop: '8px'}}>
            <Grid container item xs={12}>
                <Grid item xs={1} container alignItems="center" justifyContent="center">
                    <Grid item>
                        <Typography variant="h5" color="primary">
                            {'/'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={10} container alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <TextField
                            name="regex"
                            label="Regex"
                            type="text"
                            value={v.trim().slice(1, -1)}
                            spellCheck={false}
                            onChange={handleOnChange}
                            fullWidth
                            maxRows={10}
                            multiline
                            variant="standard"
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1} container alignItems="center" justifyContent="center">
                    <Grid item>
                        <Typography variant="h5" color="primary">
                            {'/'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

AddRegex.defaultProps = {
    identifier: null,
    init: '',
},

AddRegex.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.string,
    parent: PropTypes.string.isRequired,
};

export default AddRegex;