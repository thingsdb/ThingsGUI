/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { EditActions, useEdit } from '../Context';


const AddRoom = ({identifier, init}) => {
    const dispatch = useEdit()[1];
    const [roomId, setRoomId] = React.useState('');

    React.useEffect(()=>{
        let roomId = '';
        if(init && init.includes('room:')) {
            roomId = init.split(':')[1];
        }
        saveRoom(roomId);
    }, []);

    const handleOnChangeRoomId = ({target}) => {
        const {value} = target;
        saveRoom(value);
    };

    const saveRoom = (roomId) => {
        const c = `room(${roomId})`;
        EditActions.updateVal(dispatch, c, identifier);
        setRoomId(roomId);
    };

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
                        type="text"
                        value={roomId}
                        spellCheck={false}
                        onChange={handleOnChangeRoomId}
                        fullWidth
                        variant="standard"
                        helperText="Enter room ID or leave empty the create a new room"
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
    identifier: PropTypes.string,
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AddRoom;