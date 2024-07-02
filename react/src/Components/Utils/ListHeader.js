import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

const groupSigning = {
    '{' : ['{','}'],
    '[' : ['[', ']'],
    '(' : ['(', ')'],
};

const ListHeader = ({
    children,
    canCollapse = true,
    groupSign,
    isOpen = false,
    name = '',
    onAdd,
    unmountOnExit = false,
}) => {
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
                {canCollapse && (
                    <Button color="primary" onClick={open ? handleClose : handleOpen}>
                        {open ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

ListHeader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    canCollapse: PropTypes.bool,
    groupSign: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    name: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    unmountOnExit: PropTypes.bool,
};

export default ListHeader;