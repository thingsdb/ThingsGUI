/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
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
}));

const groupSigning = {
    '{' : ['{','}'],
    '[' : ['[', ']'],
    '(' : ['(', ')'],
};

const ListHeader = ({collapse, onAdd, onDelete, onOpen, onClose, open, items, name, groupSign}) => {
    const classes = useStyles();


    const makeAddedList = () => {
        const elements =  items.map((listitem, index) => (
            <Chip
                key={index}
                id={listitem}
                className={classes.chip}
                label={listitem}
                color="primary"
                onDelete={onDelete(index, listitem)}
            />
        ));
        return elements;
    };

    return(
        <Grid className={classes.top} container item xs={12}>
            <Grid item xs={10} container justify="flex-start" alignItems="center">
                {name&&(
                    <Typography variant="h5" color="primary" >
                        {`${name}`}
                    </Typography>
                )}
                <Typography variant="h3" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][0]}
                </Typography>
                {makeAddedList()}
                <Typography variant="h3" className={classes.sidepadding} color="primary">
                    {groupSigning[groupSign][1]}
                </Typography>
            </Grid>
            <Grid item xs={2} container justify="flex-start" alignItems="center">
                <IconButton onClick={onAdd}>
                    <AddIcon color="primary" />
                </IconButton>
                {collapse && (
                    <IconButton onClick={open ? onClose : onOpen}>
                        {open ?  <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" /> }
                    </IconButton>
                )}
            </Grid>
        </Grid>
    );
};

ListHeader.defaultProps = {
    collapse: false,
    name: '',
    onClose: ()=>null,
    onDelete: ()=>null,
    onOpen: ()=>null,
    open: false,
};

ListHeader.propTypes = {
    collapse: PropTypes.bool,
    groupSign: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
};

export default ListHeader;