/* eslint-disable react/no-multi-comp */
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


const ThingBounds = ({ onBounds, total }) => {
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
            <Typography variant="body1" style={{paddingRight: 8}}>
                {'Show tree items: '}
            </Typography>
            <TextField
                style={{width: 50}}
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
                InputProps={{
                    disableUnderline: true,
                }}
            />
            <Typography variant="body1" style={{paddingRight: 8, paddingLeft: 8}}>
                {' - '}
            </Typography>
            <TextField
                style={{width: 50}}
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
                InputProps={{
                    disableUnderline: true,
                }}
            />
            <Typography variant="body1" style={{paddingLeft: 8}}>
                {`of ${total}`}
            </Typography>
        </ListItem>
    );
};

ThingBounds.propTypes = {
    onBounds:PropTypes.func.isRequired,
    total:PropTypes.number.isRequired,
};

export default ThingBounds;
