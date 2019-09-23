import PropTypes from 'prop-types';
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import {onlyNums} from '../Util';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    dense: {
        padding: 0,
        margin: 0,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: 0,
    },
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    transitionGroup: {
        paddingTop: theme.spacing(2),
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
}));


const dataTypes = [
    'string',
    'number',
    'boolean',
];

const Add1DArray = ({cb}) => {
    const classes = useStyles();
    const helperspan = React.useRef(null);
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: dataTypes[0],
        errors: {},
    });
    const {contentAdd, dataType, errors} = state;

    const [width, setWidth] = React.useState(100);
    React.useEffect(() => {
        const helperWidth = helperspan.current.offsetWidth;
        setWidth(Math.max(50, helperWidth + 1));
    },
    [contentAdd],
    );

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        cb(myItems);
    },
    [myItems.length],
    );

    const validation = {
        contentAdd: () => {
            let errText = contentAdd.length>0 ? '' : 'required';

            if (!errText && dataType == 'number') {
                errText = onlyNums(contentAdd) ? '' : 'only numbers';
            } else if (!errText && dataType == 'boolean') {
                errText = contentAdd == 'true' || contentAdd == 'false' ? '' : 'not a boolean value';
            }
            return(errText);
        },
    };

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value, errors: {}});
    };


    const handleKeypress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky]();  return d; }, {});
            setState({...state, errors: err});
            if (!Object.values(err).some(d => d)) {


                let currentcontent = contentAdd.trim();
                if (!currentcontent) {
                    return;
                }

                const contentTypeChecked = dataType == 'string' ? '"' + currentcontent + '"' : currentcontent;
                setMyItems(prevItems => {
                    const newArray = [...prevItems];
                    newArray.push(contentTypeChecked);
                    return newArray;
                });
                setState({ ...state, contentAdd: '' });
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


    const makeAddedList = () => {
        const elements =  myItems.map((listitem, index) => (
            <Chip
                key={index}
                id={listitem}
                className={classes.chip}
                label={listitem}
                onDelete={handleClick(index)}
                color="primary"
            />
        ));
        return elements;
    };


    return (
        <div className={classes.container} >
            {makeAddedList()}
            <TextField
                className={classes.textField}
                id="dataType"
                type="text"
                name="dataType"
                onChange={handleChange}
                value={dataType}
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
            {dataType == 'boolean' ? (
                <RadioGroup className={classes.dense} aria-label="position" name="contentAdd" value={contentAdd} onChange={handleChange} row onKeyPress={handleKeypress}>
                    <FormControlLabel
                        className={classes.dense}
                        value="true"
                        control={<Radio color="primary" />}
                        label="true"
                        labelPlacement="bottom"
                    />
                    <FormControlLabel
                        className={classes.dense}
                        value="false"
                        control={<Radio color="primary" />}
                        label="false"
                        labelPlacement="bottom"
                    />
                </RadioGroup>
            ) : (
                <TextField
                    className={classes.textField}
                    id="contentAdd"
                    type="text"
                    name="contentAdd"
                    autoComplete="off"
                    onChange={handleChange}
                    onKeyPress={handleKeypress}
                    value={contentAdd}
                    style={{ width: width }}
                    variant="outlined"
                    helperText={errors.contentAdd}
                    error={Boolean(errors.contentAdd)}
                    placeholder="+"
                />
            )}
            <span
                id="helperspan"
                ref={helperspan}
                style={{'visibility': 'hidden'}}
            >
                {contentAdd}
            </span>
        </div>
    );

};

Add1DArray.propTypes = {
    cb: PropTypes.func.isRequired,
};


export default Add1DArray;


