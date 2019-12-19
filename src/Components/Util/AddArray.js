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


const AddArray = ({customTypes, dataTypes, onBlob, onVal, type}) => {
    const classes = useStyles();
    const [preBlob, setPreBlob] = React.useState({});
    const [blob, setBlob] = React.useState({});
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: type[0]||'str',
        errors: {},
    });
    const {contentAdd, dataType} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        onVal(`[${myItems}]`);
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

    return (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={1} container justify="flex-start">
                    <Typography variant="h3" color="primary">
                        {'['}
                    </Typography>
                </Grid>
                <Grid item xs={10} container >
                    {makeAddedList()}
                </Grid>
                <Grid item xs={1} container justify="flex-end">
                    <Typography variant="h3" color="primary">
                        {']'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={1} alignItems="flex-start" >
                <Grid item xs={2}>
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
                        {dataTypes.map((p) => (
                            <option key={p} value={p} disabled={!type.includes(p)}>
                                {p}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={9}>
                    <InputField
                        customTypes={customTypes}
                        dataType={dataType}
                        dataTypes={dataTypes}
                        input={contentAdd}
                        onBlob={handleBlob}
                        onVal={handleInputField}
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

AddArray.defaultProps = {
    type: [],
};

AddArray.propTypes = {
    customTypes: PropTypes.object.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    type:PropTypes.arrayOf(PropTypes.string),
};

export default AddArray;


