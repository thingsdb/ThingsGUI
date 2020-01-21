import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import InputField from '../TreeActions/InputField';
import {ListHeader} from '../../../Util';

const useStyles = makeStyles(theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        borderRight: `3px solid ${theme.palette.primary.main}`,
        borderRadius: '20px',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    nested: {
        paddingLeft: theme.spacing(6),
    },
}));

const single = [
    'bool',
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

    return (
        <Grid container>
            <ListHeader onAdd={handleAdd} onDelete={handleClick} items={myItems} groupSign="{" />
            <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="center" >
                <Grid item xs={3}>
                    <TextField
                        id="property"
                        type="text"
                        name="property"
                        label="Property"
                        onChange={handleChangeProperty}
                        value={property}
                        variant="standard"
                        fullWidth
                        autoFocus
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
                        variant="standard"
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
                        variant="standard"
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


