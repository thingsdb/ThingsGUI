import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
}));


const AddList = ({cb, dropdownItems}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        contentAdd: '',
        dropdownItem: dropdownItems[0],
    });
    const {contentAdd, dropdownItem} = state;

    const [myItems, setMyItems] = React.useState([]);
    React.useEffect(() => {
        cb(myItems);
    },
    [myItems.length],
    );

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value, errors: {}});
    };

    const handleAdd = () => {
        let currentcontent = contentAdd.trim();

        setMyItems(prevItems => {
            const newArray = [...prevItems];
            newArray.push({dropdownItem: dropdownItem, value: currentcontent});
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
                id={listitem.value}
                className={classes.chip}
                label={`${listitem.value}: '${listitem.dropdownItem}'`}
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
                            margin="dense"
                            name="contentAdd"
                            label="Value"
                            type="text"
                            value={contentAdd}
                            spellCheck={false}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="dropdownItem"
                            type="text"
                            name="dropdownItem"
                            onChange={handleChange}
                            value={dropdownItem}
                            variant="outlined"
                            select
                            SelectProps={{native: true}}
                        >
                            {dropdownItems.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </TextField>
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

AddList.propTypes = {
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AddList;


