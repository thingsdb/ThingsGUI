import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Clear';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

const groupSigning = {
    '{' : ['{','}'],
    '[' : ['[', ']'],
    '(' : ['(', ')'],
};

const ListHeader = ({children, canCollapse, groupSign, isOpen, items, name, onAdd, onDelete, onRefresh, unmountOnExit}) => {
    const [open, setOpen] = React.useState(isOpen);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return(
        <Grid container item xs={12} sx={{marginTop: '8px', marginBottom: '8px', paddingTop: '8px', paddingBottom: '8px'}}>
            <Grid item xs={7} container justifyContent="flex-start" alignItems="center">
                {name&&(
                    <Typography variant="h5" color="primary" >
                        {`${name}`}
                    </Typography>
                )}
                <Typography variant="h5" color="primary" sx={{paddingLeft: '8px', paddingRight: '8px'}}>
                    {groupSigning[groupSign][0]}
                </Typography>
            </Grid>
            <Grid item xs={open?12:1} container justifyContent="flex-start" alignItems="center" style={{visibility: open?'visible':'hidden'}}>
                <Collapse sx={{width: '100%'}} in={open} timeout="auto" unmountOnExit={unmountOnExit}>
                    {/* <Grid item xs={12} sx={{paddingLeft: '48px'}}>
                        {items.map((listitem, index) => (
                            <Box key={index}>
                                {listitem}
                                <IconButton color="primary" onClick={onDelete(index, listitem)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Grid> */}
                    {children}
                </Collapse>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-start" alignItems="center">
                <Typography variant="h5" color="primary" sx={{paddingLeft: '8px', paddingRight: '8px'}}>
                    {groupSigning[groupSign][1]}
                </Typography>
                <Button color="primary" onClick={onAdd}>
                    {'Add'}
                </Button>
                <Button color="primary" onClick={onRefresh}>
                    {'Clear'}
                </Button>
                {canCollapse && (
                    <Button color="primary" onClick={open ? handleClose : handleOpen}>
                        {open ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

ListHeader.defaultProps = {
    canCollapse: true,
    isOpen: false,
    name: '',
    onDelete: ()=>null,
    unmountOnExit: false,
};

ListHeader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    canCollapse: PropTypes.bool,
    groupSign: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onRefresh: PropTypes.func.isRequired,
    unmountOnExit: PropTypes.bool,
};

export default ListHeader;