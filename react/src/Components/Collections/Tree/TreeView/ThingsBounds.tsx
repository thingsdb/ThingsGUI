import ListItem from '@mui/material/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


const ThingsBounds = ({ onChange, total }: Props) => {
    const [from, setFrom] = React.useState('0');
    const [till, setTill] = React.useState('99');

    React.useEffect(()=>{
        if(from.length){
            onChange({from:Number.parseInt(from), till:Number.parseInt(till)});
        }
    }, [from, onChange, till]);


    const handleOnChangeFrom = ({target}: React.ChangeEvent<any>) => {
        const {value} = target;
        setFrom(value);
    };

    const handleOnChangeTill = ({target}: React.ChangeEvent<any>) => {
        const {value} = target;
        setTill(value);
    };

    return (
        <ListItem>
            <TextField
                style={{width: from.length*9+60}}
                margin="dense"
                id="from"
                slotProps={{htmlInput: {
                    min: '0',
                    style: {
                        color:'#3a6394',
                    },
                }}}
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
                slotProps={{htmlInput: {
                    min: `${from}`,
                    style: {
                        color:'#3a6394',
                    },
                }}}
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
    onChange:PropTypes.func.isRequired,
    total:PropTypes.number.isRequired,
};

export default ThingsBounds;

interface Props {
    onChange: (d: object) => void;
    total: number;
}