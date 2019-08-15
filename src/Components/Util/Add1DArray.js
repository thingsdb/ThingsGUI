import PropTypes from 'prop-types';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
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
];

const Add1DArray = ({cb}) => {
    const classes = useStyles();
    const helperspan = React.useRef(null);
    const [state, setState] = React.useState({
        contentAdd: "add +",
        dataType: dataTypes[0],
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

	const handleFocus = (_event) => {
		setState({ ...state, contentAdd: "" });
	};
	
	const handleChange = ({target}) => {
        const {id, value} = target;
		setState({...state, [id]: value });
	};

	const handleKeypress = (event) => {
        const {key} = event;
		if (key == "Enter") {

			let currentcontent = contentAdd.trim();
			if (!currentcontent) {
				return; 
            }

            const contentTypeChecked = dataType == 'string' ? "'"+ currentcontent +"'" : currentcontent;
            setMyItems(prevItems => {
                const newArray = [...prevItems];
                newArray.push(contentTypeChecked);
                return newArray;
            });
            setState({ ...state, contentAdd: "" });
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
        return elements
    };


    return (
        <div className={classes.container} >
            {makeAddedList()}
            <TextField
                className={classes.textField}
                id="dataType"
                type="text"
                name="datatype"
                autoComplete="off"
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
            <TextField
                className={classes.textField}
                id="contentAdd"
                type="text"
                name="initvalue"
                autoComplete="off"
                onFocus={handleFocus}
                onChange={handleChange}
                onKeyPress={handleKeypress}
                value={contentAdd}
                style={{ width: width }}
                variant="outlined"
            />
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


