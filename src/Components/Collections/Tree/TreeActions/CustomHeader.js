/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    bottom: {
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
}));

const CustomHeader = ({onAdd, onOpen, onClose, open, items, type, maxSteps}) => {
    const classes = useStyles();


    const makeAddedList = () => {
        const elements =  items.map((listitem, index) => (
            <Chip
                key={index}
                id={listitem}
                className={classes.chip}
                label={listitem}
                color="primary"
            />
        ));
        return elements;
    };

    return(
        <Grid className={classes.bottom} container item xs={12}>
            <Grid item xs={10} container justify="flex-start" alignItems="center">
                <Typography variant="h5" color="primary">
                    {`${type}`}
                </Typography>
                <Typography variant="h3" color="primary">
                    {'{'}
                </Typography>
                {makeAddedList()}
                <Typography variant="h3" color="primary">
                    {'}'}
                </Typography>
            </Grid>
            {maxSteps<2 ? (
                <Grid container item xs={1} alignItems="center" justify="flex-end">
                    <Fab color="primary" onClick={onAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
            ) : null}
            <Grid item xs={1} container alignItems="center" justify="flex-end">
                <Fab color="primary" onClick={open ? onClose : onOpen} size="small">
                    {open ?  <ExpandMore /> : <ChevronRightIcon /> }
                </Fab>
            </Grid>
        </Grid>
    );
};

CustomHeader.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    maxSteps: PropTypes.number.isRequired,
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
};

export default CustomHeader;