import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const ThingsBounds = ({ onBounds, total }) => {
    const [from, setFrom] = React.useState('0');
    const [till, setTill] = React.useState('99');

    React.useEffect(()=>{
        if(from.length){
            onBounds({from:Number.parseInt(from), till:Number.parseInt(till)});
        }
    }, [from, onBounds, till]);


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
            <TextField
                style={{width: from.length*9+60}}
                margin="dense"
                id="from"
                inputProps={{
                    min: '0',
                    style: {
                        color:'#3a6394',
                    },
                }}
                type="number"
                value={from}
                onChange={handleOnChangeFrom}
                size="small"
                variant="outlined"
            />
            <Typography variant="body1" style={{paddingRight: 8, paddingLeft: 8}}>
                {' — '}
            </Typography>
            <TextField
                style={{width: till.length*9+60}}
                margin="dense"
                id="till"
                inputProps={{
                    min: `${from}`,
                    style: {
                        color:'#3a6394',
                    },
                }}
                type="number"
                value={till}
                onChange={handleOnChangeTill}
                size="small"
                variant="outlined"
            />
            <Typography variant="body1" style={{paddingLeft: 8}}>
                {`of ${total}`}
            </Typography>
        </ListItem>
    );
};

ThingsBounds.propTypes = {
    onBounds:PropTypes.func.isRequired,
    total:PropTypes.number.isRequired,
};

export default ThingsBounds;
