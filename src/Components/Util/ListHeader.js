/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutlined';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import RemoveIcon from '@material-ui/icons/HighlightOff';
import React from 'react';
import Typography from '@material-ui/core/Typography';

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

const ListHeader = ({children, canCollapse, groupSign, items, name, onAdd, onDelete, onRefresh, unmountOnExit}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return(
        <Grid className={classes.top} container item xs={12}>
            <Grid item xs={7} container justify="flex-start" alignItems="center">
                {name&&(
                    <Typography variant="h5" color="primary" >
                        {`${name}`}
                    </Typography>
                )}
                <Typography variant="h3" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][0]}
                </Typography>
                <Grid item className={classes.inset}>
                    {items.map((listitem, index) => <Chip key={index} id={listitem} className={classes.chip} label={listitem} color="primary" onDelete={onDelete(index, listitem)} />)}
                </Grid>
            </Grid>
            <Grid item xs={open?12:1} container justify="flex-start" alignItems="center" style={{visibility: open?'visible':'hidden'}}>
                <Collapse className={classes.fullWidth} in={open} timeout="auto" unmountOnExit={unmountOnExit}>
                    {children}
                </Collapse>
            </Grid>
            <Grid item xs={4} container justify="flex-start" alignItems="center">
                <Typography variant="h3" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][1]}
                </Typography>
                <IconButton onClick={onAdd}>
                    <AddIcon color="primary" />
                </IconButton>
                <IconButton onClick={onRefresh}>
                    <RemoveIcon color="primary" />
                </IconButton>
                {canCollapse && (
                    <IconButton onClick={open ? handleClose : handleOpen}>
                        {open ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    </IconButton>
                )}
            </Grid>
        </Grid>
    );
};

ListHeader.defaultProps = {
    canCollapse: true,
    name: '',
    onDelete: ()=>null,
    unmountOnExit: false,
};

ListHeader.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    canCollapse: PropTypes.bool,
    groupSign: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onRefresh: PropTypes.func.isRequired,
    unmountOnExit: PropTypes.bool,
};

export default ListHeader;