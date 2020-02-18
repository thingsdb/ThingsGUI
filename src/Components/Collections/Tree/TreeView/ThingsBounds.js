/* eslint-disable react/no-multi-comp */
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';


const ThingBounds = ({ onBounds}) => {
    const [from, setFrom] = React.useState('0');
    const [till, setTill] = React.useState('99');

    React.useEffect(()=>{
        if(from.length){
            onBounds({from:Number.parseInt(from), till:Number.parseInt(till)});
        }
    }, [from, till]);


    const handleOnChangeFrom = ({target}) => {
        const {value} = target;
        setFrom(value);
    };

    const handleOnChangeTill = ({target}) => {
        const {value} = target;
        setTill(value);
    };

    return (
        <ListItem>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="from"
                        label="from"
                        inputProps={{min: '0'}}
                        type="number"
                        value={from}
                        onChange={handleOnChangeFrom}
                        size="small"
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="till"
                        label="till"
                        inputProps={{min: from}}
                        type="number"
                        value={till}
                        onChange={handleOnChangeTill}
                        size="small"
                    />
                </Grid>
            </Grid>
        </ListItem>
    );
};

ThingBounds.propTypes = {
    onBounds:PropTypes.func.isRequired,
};

export default ThingBounds;
