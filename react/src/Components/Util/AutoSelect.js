/* eslint-disable react-hooks/exhaustive-deps */
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';


const BATCH = 50;

const AutoSelect = ({onChange, label, dropdownItems, input}) => {
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
                <Popover
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={handleClose}
                    open={Boolean(anchorEl) && Boolean(list.length)}
                >
                    <Paper sx={{width : width ? width : textRef.current ? textRef.current.offsetWidth : null, border: '0.1px solid #eee'}} elevation={3}>
                        <MenuList onScroll={handleScroll} id="menu-list-grow" sx={{maxHeight: 200, overflowY: 'auto'}}>
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
                </Popover>
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