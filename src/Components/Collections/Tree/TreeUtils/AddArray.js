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
    'bytes',
    'float',
    'int',
    'nil',
    'str',
];

const AddArray = ({customTypes, dataTypes, onBlob, onVal, isSet}) => {
    const classes = useStyles();
    const [preBlob, setPreBlob] = React.useState({});
    const [blob, setBlob] = React.useState({});
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: dataTypes[0]||'str',
        errors: {},
    });
    const {contentAdd, dataType} = state;

    React.useEffect(() => {
        setState({...state, dataType: dataTypes[0]});
    },
    [dataTypes.length],
    );

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

    const handleBlob = (b) => {
        setPreBlob({...b});
    };

    console.log(dataType, dataTypes)

    return (
        <Grid container>
            <ListHeader onAdd={handleAdd} onDelete={handleClick} items={myItems} groupSign="[" />
            <Grid className={classes.nested} container item xs={12} spacing={1} alignItems="flex-end" >
                {dataTypes.length>1&&(
                    <Grid item xs={2}>
                        <TextField
                            id="dataType"
                            type="text"
                            name="dataType"
                            onChange={handleChange}
                            value={dataType}
                            variant="standard"
                            select
                            SelectProps={{native: true}}
                        >
                            {dataTypes.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                )}
                <Grid item xs={single.includes(dataType)?10:12}>
                    <InputField
                        customTypes={customTypes}
                        dataType={dataType}
                        dataTypes={dataTypes}
                        input={contentAdd}
                        onBlob={handleBlob}
                        onVal={handleInputField}
                        variant="standard"
                        label="Value"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

AddArray.defaultProps = {
    isSet: false,
};

AddArray.propTypes = {
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onBlob: PropTypes.func.isRequired,
    onVal: PropTypes.func.isRequired,
    isSet: PropTypes.bool,
};

export default AddArray;


