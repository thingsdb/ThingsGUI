import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import InputField from '../Collections/Tree/TreeActions/InputField';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        borderRight: `3px solid ${theme.palette.primary.main}`,
        borderRadius: '20px',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
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
    'uint',
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

const Add1DArray = ({cb, type}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: type||'str',
        errors: {},
    });
    const {contentAdd, dataType} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        cb(myItems);
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
        return type === 'list' ? `[${input}]`
            : type === 'thing' ? '{}'
                : type === 'set' ? '[{}]'
                    : type === 'str' ? `'${input}'`
                        : type === 'number' || type === 'bool' || type=='int' || type=='uint' || type=='float' || type === 'bytes' || type === 'closure' || type === 'regex' ||  type === 'error'  ? `${input}`
                            : type === 'nil' ? 'nil'
                                : '';
    };

    const handleAdd = () => {
        // let currentcontent = contentAdd.trim();
        const contentTypeChecked = typeControls(dataType, contentAdd);
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
        <div className={classes.container} >
            <Grid container spacing={1} >
                <Grid item xs={12}>
                    {makeAddedList()}
                </Grid>
                <Grid container item xs={12} spacing={1} alignItems="center" >
                    <Grid item>
                        <TextField
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
                                <option key={p} value={p} disabled={type==''?false:p!=type}>
                                    {p}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <InputField
                            dataType={dataType}
                            cb={handleInputField}
                            name=""
                            input={contentAdd}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <Fab color="primary" onClick={handleAdd} size="small">
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

Add1DArray.defaultProps = {
    type: '',
};

Add1DArray.propTypes = {
    cb: PropTypes.func.isRequired,
    type:PropTypes.string
};

export default Add1DArray;


