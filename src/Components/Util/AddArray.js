import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import InputField from '../Collections/Tree/TreeActions/InputField';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));

const single = [
    'bool',
    'bytes',
    'float',
    'int',
    'nil',
    'str',
];

const AddArray = ({customTypes, dataTypes, onBlob, onVal, childtype, isSet}) => {
    const classes = useStyles();
    const [preBlob, setPreBlob] = React.useState({});
    const [blob, setBlob] = React.useState({});
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: childtype[0]||'str',
        errors: {},
    });
    const {contentAdd, dataType} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        onVal(isSet?`set([${myItems}])`:`[${myItems}]`);
        onBlob(blob);
    },
    [myItems.length],
    );

    const handleInputField = (val) => {
        setState({...state, contentAdd: val, errors: {}});
    };

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, dataType: value, contentAdd: '', errors: {}});
    };

    const typeControls = (type, input) => {
        return type === 'nil' ? 'nil'
            : type === 'str' ? (input[0]=='\''? `${input}`:`'${input}'`)
                : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, contentAdd);
        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.push(contentTypeChecked);
            return newArray;
        });
        setBlob({...blob, ...preBlob});

    };

    const handleClick = (index, item) => () => {
        setBlob(prevBlob => {
            let copyState = JSON.parse(JSON.stringify(prevBlob));
            let k = Object.keys(copyState).find(i=>item.includes(i));
            delete copyState[k];
            return copyState;
        });
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
                onDelete={handleClick(index, listitem)}
                color="primary"
            />
        ));
        return elements;
    };

    const handleBlob = (b) => {
        setPreBlob({...b});
    };

    const types = childtype.length?childtype:dataTypes;

    return (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'['}
                    </Typography>
                </Grid>
                <Grid item xs={9} container >
                    {makeAddedList()}
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {']'}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Fab color="primary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1} alignItems="flex-start" >
                <Grid item xs={3}>
                    <TextField
                        id="dataType"
                        type="text"
                        name="dataType"
                        onChange={handleChange}
                        value={dataType}
                        variant="outlined"
                        select
                        SelectProps={{native: true}}
                        fullWidth
                    >
                        {types.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={single.includes(dataType)?7:12}>
                    <InputField
                        customTypes={customTypes}
                        dataType={dataType}
                        dataTypes={dataTypes}
                        input={contentAdd}
                        onBlob={handleBlob}
                        onVal={handleInputField}
                        variant="outlined"
                        label="Value"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

AddArray.defaultProps = {
    childtype: [],
    isSet: false,
};

AddArray.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    childtype:PropTypes.arrayOf(PropTypes.string),
    isSet: PropTypes.bool,
};

export default AddArray;


