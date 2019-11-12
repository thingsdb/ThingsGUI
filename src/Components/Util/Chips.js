import Chip from '@material-ui/core/Chip';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {HarmonicCard} from '.';


const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    customWidth: {
        maxWidth: 500,
    },
}));


const Chips = ({title, items, onAdd, onClick, onDelete}) => {
    const classes = useStyles();

    const handleClick = (index) => () => {
        onClick(index);
    };

    const handleClickDelete = (index) => () => {
        onDelete(index);
    };

    const handleClickAdd = () => {
        onAdd();
    };

    return (
        <HarmonicCard
            title={title.toUpperCase()}
            content={
                <React.Fragment>
                    {items && items.length ? items.map((listitem, index) => (
                        <Tooltip
                            key={index}
                            disableFocusListener
                            disableTouchListener
                            classes={{ tooltip: classes.customWidth }}
                            title={
                                <Typography variant="caption">
                                    {listitem.doc&&listitem.doc!=''?listitem.doc:listitem.definition}
                                </Typography>
                            }
                        >
                            <Chip
                                clickable
                                id={listitem.name}
                                className={classes.chip}
                                label={listitem.name}
                                onClick={handleClick(index)}
                                onDelete={handleClickDelete(index)}
                                color="primary"
                            />
                        </Tooltip>
                    )) : `No ${title}.`}
                </React.Fragment>
            }
            buttons={
                <Chip
                    clickable
                    className={classes.chip}
                    label="ADD"
                    onClick={handleClickAdd}
                    color="primary"
                    variant="outlined"
                />
            }
        />
    );
};

Chips.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Chips;