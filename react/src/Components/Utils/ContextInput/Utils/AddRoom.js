/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EditActions, useEdit } from '../Context';
import { ROOM_FORMAT_QUERY } from '../../../../TiQueries/Queries';

const onlyInts = (str) => str.length == str.replace(/[^0-9]/g, '').length;

const AddRoom = ({identifier, init, parent}) => {
    const [editState, dispatch] = useEdit();
    const {val} = editState;
    const [roomId, setRoomId] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(()=>{
        if (val) {
            let v = identifier === null ? val.slice(5, -1) : val[identifier].slice(5, -1) || '';
            setRoomId(v);
        } else {
            setRoomId('');
        }
    }, [identifier, val]);

    React.useEffect(()=>{
        let roomId = '';
        if(init && init.includes('room:')) {
            let re = /((?<=<room:)[0-9]*(?=>))/g;
            let match = init.match(re);
            roomId = match ? match[0] : '';
        }
        saveRoom(roomId);
    }, []);

    const handleOnChangeRoomId = ({target}) => {
        const {value} = target;
        setError(onlyInts(value) ? '' : 'Input needs to be an integer');
        saveRoom(value);
    };

    const saveRoom = (roomId) => {
        const c = ROOM_FORMAT_QUERY(roomId);
        EditActions.update(dispatch, 'val', c, identifier, parent);
        setRoomId(roomId);
    };

    const hasError = Boolean(error);

    return(
        <Grid container item xs={12} spacing={1} sx={{paddingTop: '8px', marginTop: '8px'}}>
            <Grid item xs={2} container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {'room('}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={9} container>
                <Grid item xs={12}>
                    <TextField
                        name="roomId"
                        label="Room ID"
                        type="text" // setting to "number" contains bug. On entering value e the input is cleared.
                        value={roomId}
                        spellCheck={false}
                        onChange={handleOnChangeRoomId}
                        fullWidth
                        variant="standard"
                        error={hasError}
                        helperText={hasError ? error : 'Enter room ID or leave empty the create a new room'}
                    />
                </Grid>
            </Grid>
            <Grid item xs={1} container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography variant="h5" color="primary">
                        {')'}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

AddRoom.defaultProps = {
    identifier: null,
    init: '',
},

AddRoom.propTypes = {
    identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    parent: PropTypes.string.isRequired,
};

export default AddRoom;