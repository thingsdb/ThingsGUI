
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Cancel';
import RunIcon from '@material-ui/icons/DirectionsRun';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {ErrorMsg, HarmonicCard, SimpleModal, CardMultiButton} from '../Util';


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

const tag = '30';

const ChipsCard = ({title, items, onAdd, onEdit, onDelete, onRun, moreButtons, expand}) => {
    const classes = useStyles();
    const [deleteIndex, setDeleteIndex] = React.useState(null);
    const [switchDel, setSwitchDel] = React.useState(false);


    const handleOpenEdit = (index) => ({target}) => {
        onEdit(index, target);
    };

    const handleOpenRun = (index) => ({target}) => {
        onRun(index, target);
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

    const buttons = (index)=>([
        {
            icon: <RunIcon fontSize="small" />,
            onClick: handleOpenRun(index),
        },
        {
            icon: <EditIcon fontSize="small" />,
            onClick: handleOpenEdit(index),
        },
        {
            icon: <RemoveIcon fontSize="small" />,
            onClick: handleOpenDelete(index),
        },
    ]);

    return (
        <React.Fragment>
            <HarmonicCard
                title={title.toUpperCase()}
                expand={expand}
                content={
                    <React.Fragment>
                        {items && items.length ? items.map((listitem, index) => (
                            // <Tooltip
                            //     key={index}
                            //     disableFocusListener
                            //     disableTouchListener
                            //     disableHoverListener={Boolean(!(listitem.doc||listitem.definition))}
                            //     classes={{ tooltip: classes.customWidth }}
                            //     title={
                            //         <Typography variant="caption">
                            //             {listitem.doc&&listitem.doc!=''?listitem.doc:listitem.definition}
                            //         </Typography>
                            //     }
                            // >
                            //     <CardMultiButton
                            //         className={classes.chip}
                            //         label={listitem.name}
                            //         buttons={onRun?buttons(index):buttons(index).slice(1)}
                            //         color="primary"
                            //     />
                            // </Tooltip>
                            <CardMultiButton
                                key={index}
                                // className={classes.chip}
                                label={listitem.name}
                                buttons={onRun?buttons(index):buttons(index).slice(1)}
                                color="primary"
                            />
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
                        {moreButtons}
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
                        label="Are you really sure?"
                    />
                </React.Fragment>
            </SimpleModal>
        </React.Fragment>
    );
};

ChipsCard.defaultProps = {
    expand: null,
    moreButtons: null,
    onRun: null,
},

ChipsCard.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRun: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
    expand: PropTypes.bool,
    moreButtons: PropTypes.object
};

export default ChipsCard;