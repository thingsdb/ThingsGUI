/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Popper from '@material-ui/core/Popper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    list: {
        maxHeight: 200,
        overflowY: 'auto',
        zIndex: 1500
    },
    paper: {
        border: `0.8px solid ${theme.palette.primary.main}`,
        zIndex: 1500
    },
    popper: {
        zIndex: 1500,
    },

}));

const AutoSelect = ({cb, label, dropdownItems, input}) => {
    const classes = useStyles();
    const textRef = React.useRef(null);
    const [text, setText] = React.useState(input);
    const [list, setList] = React.useState(dropdownItems);
    const [anchorEl, setAnchorEl] = React.useState(false);
    const [width, setWidth] = React.useState(null);


    React.useEffect(() => {
        window.addEventListener('resize', handleRefSize);
        return () => {
            window.removeEventListener('resize', handleRefSize);
        };
    },[]);

    React.useEffect(() => {
        if (input !== text) {
            setText(input);
        }
    },
    [input],
    );

    const handleRefSize = () => {
        if (textRef.current) {
            setWidth(textRef.current.offsetWidth);
        }
    };

    const handleChange = (e) => {
        const {value} = e.target;
        setAnchorEl(true);
        handleText(value);

        // filter dropdown list
        const filt = dropdownItems.filter(i=> i.includes(value));
        setList(filt);
    };

    const handleClick = (i) => () => {
        handleText(i);
        setAnchorEl(false);
    };

    const handleOpen = () => {
        setAnchorEl(true);
    };

    const handleClose = () => {
        setAnchorEl(false);
    };

    const handleText = (v) => {
        setText(v);
        cb(v);
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={label}
                    name="text"
                    onChange={handleChange}
                    onClick={handleOpen}
                    spellCheck={false}
                    type="text"
                    value={text}
                    variant="standard"
                    inputRef={textRef}
                />

                <Popper
                    open={Boolean(anchorEl)&&Boolean(list.length)}
                    anchorEl={() => textRef.current}
                    onClose={handleClose}
                    placement="bottom"
                    className={classes.popper}
                    style={width?{width:width}:textRef.current?{width:textRef.current.offsetWidth}:null}
                >
                    <Paper className={classes.paper} elevation={3}>
                        <List className={classes.list}>
                            {list.map( (p, i) => (
                                <ListItem button key={i} onClick={handleClick(p)} >
                                    {p}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Popper>
            </Grid>
        </ClickAwayListener>
    );
};

AutoSelect.defaultProps = {
    input: '',
};

AutoSelect.propTypes = {
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.string,
    label: PropTypes.string.isRequired,
};

export default AutoSelect;