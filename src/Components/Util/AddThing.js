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


const dataTypes = [ // Do not put array first; causes infinite loop
    'str',
    'number',
    'bool',
    'int',
    'float',
    // 'bytes',
    'closure',
    'regex',
    'error',
    'nil',
    'list',
    'set',
    'thing',
];

const AddThing = ({cb, type}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: 'str',
        errors: {},
        property: '',
    });
    const {contentAdd, dataType, property} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        cb(`{${myItems}}`);
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
        return type === 'nil' ? 'nil'
            : `${input}`;
    };

    const handleAdd = () => {
        // let currentcontent = contentAdd.trim();
        const contentTypeChecked = typeControls(dataType, `${property}: ${contentAdd}`);
        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.push(contentTypeChecked);
            return newArray;
        });

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
        <Grid container spacing={1} >
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'{'}
                    </Typography>
                </Grid>
                <Grid item xs={10} container>
                    {makeAddedList()}
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {'}'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1} alignItems="flex-start" >
                <Grid item xs={2}>
                    <TextField
                        id="property"
                        type="text"
                        name="property"
                        label="Property"
                        onChange={handleChangeProperty}
                        value={property}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={2}>
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
                    >
                        {dataTypes.map((p) => (
                            <option key={p} value={p} disabled={type==''?false:p!=type}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={7}>
                    <InputField
                        dataType={dataType}
                        cb={handleInputField}
                        name="Input"
                        input={contentAdd}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={1}>
                    <Fab color="primary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
        </Grid>
    );
};

AddThing.defaultProps = {
    type: '',
};

AddThing.propTypes = {
    cb: PropTypes.func.isRequired,
    type:PropTypes.string
};

export default AddThing;


