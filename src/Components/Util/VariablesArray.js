/* eslint-disable react-hooks/exhaustive-deps */
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));


const VariablesArray = ({input, cb}) => {
    const classes = useStyles();
    const [item, setItem] = React.useState('');
    const [error, setError] = React.useState('');

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        if(!deepEqual(myItems, input)) {
            cb(myItems);
        }
    },
    [myItems.length],
    );

    React.useEffect(() => {
        if(!deepEqual(myItems, input)) {
            setMyItems(input);
        }
    },
    [JSON.stringify(input)], // TODO stringify
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setItem(value);
        setError('');
    };

    const handleKeypress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            const err = /^[a-zA-Z].*/.test(item) ? '':'start variable name with a word character';
            setError(err);
            if (!err) {
                let currentcontent = item.trim();
                if (!currentcontent) {
                    return;
                }
                setMyItems(prevItems => {
                    const newArray = [...prevItems];
                    newArray.push(currentcontent);
                    return newArray;
                });
                setItem('');
            }
        }
    };

    const handleClick = (index) => () => {
        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.splice(index, 1);
            return newArray;
        });
    };

    return (
        <div>
            {myItems.map((listitem, index) => <Chip key={index} id={listitem} className={classes.chip} label={listitem} onDelete={handleClick(index)} color="primary" />)}
            <TextField
                name="input"
                // label="Variable"
                type="text"
                value={item}
                spellCheck={false}
                onChange={handleChange}
                variant="outlined"
                style={{ width: 150 }}
                onKeyDown={handleKeypress}
                error={Boolean(error)}
                helperText={error||'Add + hit "Enter"'}
            />
        </div>
    );
};

VariablesArray.defaultProps = {
    input: [],
};

VariablesArray.propTypes = {
    cb: PropTypes.func.isRequired,
    input: PropTypes.arrayOf(PropTypes.any),
};

export default VariablesArray;


