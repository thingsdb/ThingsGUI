/* eslint-disable react-hooks/exhaustive-deps */
import { alpha } from '@mui/material/styles';
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

import useStateCallback from './useStateCallback';


const VariablesArray = ({
    input = [],
    onChange
}) => {
    const [item, setItem] = React.useState('');

    const [myItems, setMyItems] = useStateCallback([]);

    React.useEffect(() => {
        if(!deepEqual(myItems, input)) {
            setMyItems(input);
        }
    }, [input]);

    const handleChange = ({target}) => {
        const {value} = target;
        setItem(value);
    };

    const handleKeypress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            let currentcontent = item.trim();
            if (!currentcontent) {
                return;
            }
            setMyItems(prevItems => {
                const newArray = [...prevItems];
                newArray.push(currentcontent);
                return newArray;
            }, onChange);
            setItem('');
        }
    };

    const handleClick = (index) => () => {
        setMyItems(
            prevItems => {
                const newArray = [...prevItems];
                newArray.splice(index, 1);
                return newArray;
            }, onChange);
    };

    return (
        <div>
            {myItems.map((listitem, index) => (
                <Chip
                    color="primary"
                    id={listitem}
                    key={index}
                    label={listitem}
                    onDelete={handleClick(index)}
                    sx={{
                        color: '#000',
                        margin: '8px',
                        padding: '8px',
                        '& .MuiChip-deleteIcon': {
                            color: '#000',
                            '&:hover': {
                                color: alpha('#000', 0.60),
                            },
                        }
                    }}
                />
            ))}
            <TextField
                helperText={'Add + hit "Enter"'}
                name="input"
                onChange={handleChange}
                onKeyDown={handleKeypress}
                spellCheck={false}
                style={{ width: 150 }}
                type="text"
                value={item}
                variant="outlined"
            />
        </div>
    );
};

VariablesArray.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.arrayOf(PropTypes.any), // eslint-disable-line
};

export default VariablesArray;


