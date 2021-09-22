import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/AddCircle';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import RemoveIcon from '@mui/icons-material/RemoveCircle';
import React from 'react';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        maxWidth: 300,
    },
    top: {
        marginTop: theme.spacing(1),
        paddingTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    sidepadding: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    inset: {
        paddingLeft: theme.spacing(3),
    },
    fullWidth: {
        width: '100%',
    },
}));

const groupSigning = {
    '{' : ['{','}'],
    '[' : ['[', ']'],
    '(' : ['(', ')'],
};

const ListHeader = ({children, canCollapse, groupSign, isOpen, items, name, onAdd, onDelete, onRefresh, unmountOnExit}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(isOpen);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return(
        <Grid className={classes.top} container item xs={12}>
            <Grid item xs={7} container justifyContent="flex-start" alignItems="center">
                {name&&(
                    <Typography variant="h5" color="primary" >
                        {`${name}`}
                    </Typography>
                )}
                <Typography variant="h5" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][0]}
                </Typography>
                <Grid item className={classes.inset}>
                    {items.map((listitem, index) => <Chip key={index} id={listitem} className={classes.chip} label={listitem} color="primary" onDelete={onDelete(index, listitem)} />)}
                </Grid>
            </Grid>
            <Grid item xs={open?12:1} container justifyContent="flex-start" alignItems="center" style={{visibility: open?'visible':'hidden'}}>
                <Collapse className={classes.fullWidth} in={open} timeout="auto" unmountOnExit={unmountOnExit}>
                    {children}
                </Collapse>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-start" alignItems="center">
                <Typography variant="h5" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][1]}
                </Typography>
                <Button color="primary" onClick={onAdd}>
                    <AddIcon color="primary" />
                </Button>
                <Button color="primary" onClick={onRefresh}>
                    <RemoveIcon color="primary" />
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