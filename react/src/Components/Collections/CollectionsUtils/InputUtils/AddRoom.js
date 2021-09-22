/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import {EditActions, useEdit} from '../Context';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
}));

const AddRoom = ({identifier, init}) => {
    const classes = useStyles();
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
        <Grid className={classes.container} container item xs={12} spacing={2}>
            <Grid item xs={2} container justifyContent="center">
                <Typography variant="h3" color="primary">
                    {'room('}
                </Typography>
            </Grid>
            <Grid item xs={4} container justifyContent="center">
                <TextField
                    name="roomId"
                    label="Room ID"
                    type="text"
                    value={roomId}
                    spellCheck={false}
                    onChange={handleOnChangeRoomId}
                    fullWidth
                    variant="outlined"
                    helperText="Enter room ID or leave empty the create a new room"
                />
            </Grid>
            <Grid item xs={1} container justifyContent="center">
                <Typography variant="h3" color="primary">
                    {')'}
                </Typography>
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