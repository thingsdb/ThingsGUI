import PropTypes from 'prop-types';
import React from 'react';
import Chip from '@material-ui/core/Chip';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

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


let lastId = -1;

const dataTypes = [
    'string',
    'number',
];

const initialState = {
    contentAdd: "add +",
    dataType: dataTypes[0],
    width: 100,
    myItems: [],
};

const AddArray = ({items, cb}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {contentAdd, dataType, width, myItems} = state;

    const helperspan = React.useRef(null);
    React.useEffect(() => {
            let newArray = [];
            items.map((item, index) => {
                setState(prevState => {
                    newArray.push(item);
                    return {...prevState, myItems: newArray};
                });	
            });
        },
        [items],
    ); 

    React.useEffect(() => {
            const helperWidth = helperspan.current.offsetWidth;
            setState({ ...state, width: Math.max(50, helperWidth + 1) });
        },
        [contentAdd],
    ); 

    React.useEffect(() => {
            console.log('useEffect addarray')
            cb(myItems);
        },
        [myItems.length],
    ); 

	const handleFocus = (_event) => {
		setState({ ...state, contentAdd: "" });
	};
	
	const handleChange = ({target}) => {
        const {id, value} = target;
        console.log(state);
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

			let currentWidth = helperspan.current.offsetWidth;
            setState(prevState => {
                const newArray = prevState.myItems;
                newArray.push(contentTypeChecked);
                return {...prevState, contentAdd: "", myItems: newArray};
            });		
		}
	};

	const handleClick = (item) => () => {
		const newArray = myItems.filter((listitem) => {return listitem !== item});
		setState({ ...state, myItems: newArray });
	};
	    

	const makeAddedList = () => {
		const elements =  myItems.map((listitem, index) => (
                <Chip
                    key={index}
                    id={listitem}
                    className={classes.chip}
                    label={listitem}
                    onDelete={handleClick(listitem)}
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
                {dataTypes.map(p => (
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

AddArray.defaultProps = {
    items: [],
};

AddArray.propTypes = {
    items: PropTypes.array,
    cb: PropTypes.func.isRequired,
};


export default AddArray;


