/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

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

const BATCH = 50;

const AutoSelect = ({onChange, label, dropdownItems, input}) => {
    const classes = useStyles();
    const textRef = React.useRef(null);
    const [end, setEnd] = React.useState(BATCH);
    const [text, setText] = React.useState(input);
    const [list, setList] = React.useState(dropdownItems);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [width, setWidth] = React.useState(null);


    React.useEffect(() => {
        if(anchorEl){
            window.addEventListener('resize', handleRefSize);
            setWidth(textRef.current.offsetWidth);
        }
        return () => {
            window.removeEventListener('resize', handleRefSize);
        };
    },[anchorEl]);

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
        handleText(value);

        // filter dropdown list
        const filt = dropdownItems.filter(i=> i.includes(value));
        setList(filt);
    };

    const handleClick = (i) => () => {
        handleText(i);
        handleClose();
    };

    const handleOpen = ({currentTarget}) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setEnd(BATCH);
    };

    const handleText = (v) => {
        setText(v);
        onChange(v);
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && (list.slice(0, end).length % BATCH === 0)) {
            setEnd(end => end + BATCH);
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Grid item xs={12}>
                <TextField
                    autoComplete="off"
                    fullWidth
                    inputRef={textRef}
                    label={label}
                    name="text"
                    onChange={handleChange}
                    onClick={handleOpen}
                    spellCheck={false}
                    type="text"
                    value={text}
                    variant="standard"
                />

                <Popper
                    anchorEl={() => textRef.current}
                    className={classes.popper}
                    onClose={handleClose}
                    open={Boolean(anchorEl) && Boolean(list.length)}
                    placement="bottom"
                    style={width ? { width: width } : textRef.current ? { width: textRef.current.offsetWidth } : null}
                    transition
                >
                    <Paper className={classes.paper} elevation={3}>
                        <MenuList onScroll={handleScroll} className={classes.list} id="menu-list-grow">
                            {list.slice(0, end).map( (item, index) => (
                                <MenuItem
                                    dense
                                    key={`menu_item_${index}`}
                                    onClick={handleClick(item)}
                                >
                                    <ListItemText
                                        secondary={item}
                                    />
                                </MenuItem>
                            ))}
                        </MenuList>
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
    onChange: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    input: PropTypes.string,
    label: PropTypes.string.isRequired,
};

export default AutoSelect;