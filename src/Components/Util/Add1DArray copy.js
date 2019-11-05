import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import InputField from '../Collection/InputField';
import {ArrayLayout, onlyNums} from '../Util';

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: 0,
    },
}));


const dataTypes = [
    'string',
    'number',
    'boolean',
    'nil',
    'thing',
    'closure',
    'blob',
    'array',
];

const Add1DArray = ({cb}) => {
    const classes = useStyles();

    const [dataType, setDataType] = React.useState([dataTypes[0]]);
    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        cb(myItems);
    },
    [myItems.length],
    );

    const handleInputField = (i) => (val) => {
        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.splice(i, 1, val);
            return newArray;
        });
    };

    const handleChange = (i) => ({target}) => {
        const {value} = target;
        setDataType(prevItems => {
            const newArray = [...prevItems];
            newArray.splice(i, 1, value);
            return newArray;
        });
    };


    // const handleAdd = () => {
    //     let currentcontent = contentAdd.trim();
    //     if (!currentcontent) {
    //         return;
    //     }

    //     const contentTypeChecked = dataType == 'string' ? '"' + currentcontent + '"' : currentcontent;
    //     setMyItems(prevItems => {
    //         const newArray = [...prevItems];
    //         newArray.splice(contentTypeChecked);
    //         return newArray;
    //     });
    //     setState({ ...state, contentAdd: '' });

    // };

    return (
        <ArrayLayout
            child={(i) => (
                <Card className={classes.card} raised>
                    <TextField
                        className={classes.textField}
                        id="dataType"
                        type="text"
                        name="dataType"
                        onChange={handleChange(i)}
                        value={dataType[i]}
                        variant="outlined"
                        select
                        SelectProps={{native: true}}
                    >
                        {dataTypes.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                    <InputField
                        className={classes.textField}
                        dataType={dataType[i]}
                        cb={handleInputField(i)}
                        name="+"
                        // input={myItems[i]}
                    />
                </Card>
            )}
        />

    );
};

Add1DArray.propTypes = {
    cb: PropTypes.func.isRequired,
};


export default Add1DArray;



