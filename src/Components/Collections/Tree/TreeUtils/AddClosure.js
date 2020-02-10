import PropTypes from 'prop-types';
import React from 'react';

import {Closure} from '../../../Util';
import {EditActions, useEdit} from '../TreeActions/Context';


const AddClosure = ({identifier}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;

    const handleUpdateVal = (c) => {
        EditActions.updateVal(dispatch, c, identifier);
    };

    return(
<<<<<<< HEAD
        <Closure input={val[identifier]||(val.constructor === Object?'':val)} cb={handleUpdateVal} />
=======
        <Grid className={classes.container} container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'|'}
                    </Typography>
                </Grid>
                <Grid item xs={10} container >
                    <VariablesArray cb={handleVarArray} input={variables} />
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {'|'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} container justify="center">
                <TextField
                    name="body"
                    label="Body"
                    type="text"
                    value={body}
                    spellCheck={false}
                    onChange={handleBody}
                    fullWidth
                    multiline
                    rows="4"
                    variant="outlined"
                />
            </Grid>
        </Grid>
>>>>>>> c45ac5f79b7eb41f6502f33991a7dd4023324e49
    );
};

AddClosure.defaultProps = {
    identifier: null,
},

AddClosure.propTypes = {
    identifier: PropTypes.string
};

export default AddClosure;