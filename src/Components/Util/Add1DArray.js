import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import InputField from '../Collection/InputField';

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
    'string',
    'number',
    'boolean',
    'closure',
    'nil',
    'list',
    'set',
    'thing',
];

const Add1DArray = ({cb}) => {
    const classes = useStyles();
    const helperspan = React.useRef(null);
    const [state, setState] = React.useState({
        contentAdd: '',
        dataType: 'string',
        errors: {},
    });
    const {contentAdd, dataType} = state;

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

    const handleInputField = (val) => {
        setState({...state, contentAdd: val, errors: {}});
    };

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value, errors: {}});
    };


    // const handleKeypress = (event) => {
    //     const {key} = event;
    //     if (key == 'Enter') {
    //         const err = '';//Object.keys(errorTxt).reduce((d, ky) => { d[ky] = errorTxt[ky]();  return d; }, {});
    //         setState({...state, errors: err});
    //         if (!Object.values(err).some(d => d)) {


    //             let currentcontent = contentAdd.trim();
    //             if (!currentcontent) {
    //                 return;
    //             }

    //             const contentTypeChecked = dataType == 'string' ? '"' + currentcontent + '"' : currentcontent;
    //             setMyItems(prevItems => {
    //                 const newArray = [...prevItems];
    //                 newArray.push(contentTypeChecked);
    //                 return newArray;
    //             });
    //             setState({ ...state, contentAdd: '' });
    //         }
    //     }
    // };

    const typeControls = (type, input) => {
        return type === 'list' ? `[${input}]`
            : type === 'thing' ? '{}'
                : type === 'set' ? '[{}]'
                    : type === 'string' ? `'${input}'`
                        : type === 'closure' || type === 'number' || type === 'boolean' || type === 'blob' ? `${input}`
                            : type === 'nil' ? 'nil'
                                : '';
    };

    const handleAdd = () => {
        let currentcontent = contentAdd.trim();

        const contentTypeChecked = typeControls(dataType, currentcontent);
        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.push(contentTypeChecked);
            return newArray;
        });
        setState({ ...state, contentAdd: '' });

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
                                <option key={p} value={p}>
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
                            style={{ width: width }}
                        />
                    </Grid>
                    <Grid item>
                        <Fab color="secondary" onClick={handleAdd} size="small">
                            <AddIcon fontSize="small" />
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
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


