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
    // container: {
    //     // display: 'flex',
    //     // flexWrap: 'wrap',
    //     borderLeft: `3px solid ${theme.palette.primary.main}`,
    //     borderRight: `3px solid ${theme.palette.primary.main}`,
    //     borderRadius: '20px',
    //     padding: theme.spacing(2),
    //     margin: theme.spacing(2),
    // },
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));


// const dataTypes = [ // Do not put array first; causes infinite loop
//     'str',
//     'bool',
//     'int',
//     'float',
//     'bytes',
//     'closure',
//     'regex',
//     'error',
//     'nil',
//     'list',
//     'set',
//     'thing',
// ];

const single = [
    'bool',
    'bytes',
    'float',
    'int',
    'nil',
    'str',
];

const AddThing = ({customTypes, dataTypes, onBlob, onVal}) => {
    const classes = useStyles();
    const [preBlob, setPreBlob] = React.useState({});
    const [blob, setBlob] = React.useState({});
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: 'str',
        errors: {},
        property: '',
    });
    const {contentAdd, dataType, property} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        onVal(`{${myItems}}`);
        onBlob(blob);
    },
    [myItems.length],
    );

    const handleInputField = (val) => {
        setState({...state, contentAdd: val, errors: {}});
    };

    const handleChangeProperty = ({target}) => {
        const {value} = target;
        setState({...state, property: value, errors: {}});
    };

    const handleChangeType = ({target}) => {
        const {value} = target;
        setState({...state, dataType: value, contentAdd: '', errors: {}});
    };

    const typeControls = (type, input) => {
        return type === 'nil' ? `${input} nil`
            : `${input}`;
    };

    const handleAdd = () => {
        const contentTypeChecked = typeControls(dataType, `${property}: ${contentAdd}`);
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

    const handleBlob = (b) => {
        setPreBlob({...b});
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

    return (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'{'}
                    </Typography>
                </Grid>
                <Grid item xs={9} container>
                    {makeAddedList()}
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {'}'}
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
                        id="property"
                        type="text"
                        name="property"
                        label="Property"
                        onChange={handleChangeProperty}
                        value={property}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        id="dataType"
                        type="text"
                        name="dataType"
                        label="Data type"
                        onChange={handleChangeType}
                        value={dataType}
                        variant="outlined"
                        select
                        SelectProps={{native: true}}
                        fullWidth
                    >
                        {dataTypes.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={single.includes(dataType)?6:12}>
                    <InputField
                        customTypes={customTypes}
                        dataType={dataType}
                        dataTypes={dataTypes}
                        input={contentAdd}
                        name="Input"
                        onVal={handleInputField}
                        onBlob={handleBlob}
                        variant="outlined"
                        label="Value"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};


AddThing.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
};

export default AddThing;

