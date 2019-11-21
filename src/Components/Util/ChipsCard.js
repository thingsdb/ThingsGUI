import Chip from '@material-ui/core/Chip';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import {ErrorMsg, HarmonicCard, SimpleModal} from '../Util';


const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    customWidth: {
        maxWidth: 500,
    },
}));


const ChipsCard = ({title, items, onAdd, onClick, onDelete, tag}) => {
    const classes = useStyles();
    const [deleteIndex, setDeleteIndex] = React.useState(null);

    const handleClick = (index) => () => {
        onClick(index);
    };

    const handleClickDelete = () => {
        setDeleteIndex(null);
        onDelete(deleteIndex);
    };

    const handleClickAdd = () => {
        onAdd();
    };

    const handleOpenDelete = (index) => () => {
        setDeleteIndex(index);
    };

    const handleCloseDelete = () => {
        setDeleteIndex(null);
    };

    return (
        <React.Fragment>
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
                                    onDelete={handleOpenDelete(index)}
                                    color="primary"
                                />
                            </Tooltip>
                        )) : `No ${title}.`}
                    </React.Fragment>
                }
                buttons={
                    <React.Fragment>
                        <Chip
                            clickable
                            className={classes.chip}
                            label="ADD"
                            onClick={handleClickAdd}
                            color="primary"
                            variant="outlined"
                        />
                    </React.Fragment>
                }
            />
            <SimpleModal
                open={deleteIndex!=null}
                onClose={handleCloseDelete}
                onOk={handleClickDelete}
                maxWidth="xs"
                title={deleteIndex!=null?`Are you sure you want to remove '${items[deleteIndex]&&items[deleteIndex].name}'?`:''}
            >
                <ErrorMsg tag={tag} />
            </SimpleModal>
        </React.Fragment>
    );
};

ChipsCard.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

export default ChipsCard;