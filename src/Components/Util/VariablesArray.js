/* eslint-disable react-hooks/exhaustive-deps */
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import useStateCallback from './useStateCallback';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));

const VariablesArray = ({input, onChange}) => {
    const classes = useStyles();
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
            {myItems.map((listitem, index) => <Chip key={index} id={listitem} className={classes.chip} label={listitem} onDelete={handleClick(index)} color="primary" />)}
            <TextField
                name="input"
                type="text"
                value={item}
                spellCheck={false}
                onChange={handleChange}
                variant="outlined"
                style={{ width: 150 }}
                onKeyDown={handleKeypress}
                helperText={'Add + hit "Enter"'}
            />
        </div>
    );
};

VariablesArray.defaultProps = {
    input: [],
};

VariablesArray.propTypes = {
    onChange: PropTypes.func.isRequired,
    input: PropTypes.arrayOf(PropTypes.any),
};

export default VariablesArray;


