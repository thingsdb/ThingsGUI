
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {ErrorMsg, HarmonicCard, SimpleModal} from '../Util';


const useStyles = makeStyles(theme => ({
    chip: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    customWidth: {
        maxWidth: 500,
    },
    warning: {
        color: theme.palette.primary.red
    }
}));


const ChipsCard = ({title, items, onAdd, onClick, onDelete, expand, tag}) => {
    const classes = useStyles();
    const [deleteIndex, setDeleteIndex] = React.useState(null);
    const [switchDel, setSwitchDel] = React.useState(false);

    const handleClick = (index) => () => {
        onClick(index);
    };

    const handleClickDelete = () => {
        onDelete(deleteIndex, handleCloseDelete);
    };

    const handleClickAdd = () => {
        onAdd();
    };

    const handleOpenDelete = (index) => () => {
        setDeleteIndex(index);
    };
    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchDel(checked);
    };
    const handleCloseDelete = () => {
        setDeleteIndex(null);
        setSwitchDel(false);
    };

    return (
        <React.Fragment>
            <HarmonicCard
                title={title.toUpperCase()}
                expand={expand}
                content={
                    <React.Fragment>
                        {items && items.length ? items.map((listitem, index) => (
                            <Tooltip
                                key={index}
                                disableFocusListener
                                disableTouchListener
                                disableHoverListener={Boolean(!(listitem.doc||listitem.definition))}
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
                actionButtons={
                    <Button onClick={handleClickDelete} disabled={!switchDel} className={classes.warning}>
                        {'Submit'}
                    </Button>
                }
                maxWidth="xs"
                title={deleteIndex!=null?`Are you sure you want to remove '${items[deleteIndex]&&items[deleteIndex].name}'?`:''}
            >
                <React.Fragment>
                    <ErrorMsg tag={tag} />
                    <FormControlLabel
                        control={(
                            <Switch
                                checked={switchDel}
                                color="primary"
                                id="description"
                                onChange={handleSwitch}
                            />
                        )}
                        label="Are you realy sure?"
                    />
                </React.Fragment>
            </SimpleModal>
        </React.Fragment>
    );
};

ChipsCard.defaultProps = {
    expand: null,
},

ChipsCard.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    expand: PropTypes.bool,
    tag: PropTypes.string.isRequired,
};

export default ChipsCard;