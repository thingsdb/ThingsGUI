import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import SaveIcon from '@mui/icons-material/Save';


const ViewEditFields = ({
    canEdit,
    editComponent = null,
    label,
    onSave = () => null,
    viewComponent,
}) => {
    const [edit, setEdit] = React.useState(false);

    const handleEdit = () => {
        setEdit(true);
    };

    const handleClose = () => {
        setEdit(false);
    };

    const handleSave = () => {
        setEdit(false);
        onSave();
    };

    return (
        <List dense disablePadding>
            <ListItem
                secondaryAction={!canEdit ? null
                    : edit ? (
                        <React.Fragment>
                            <IconButton onClick={handleSave}>
                                <SaveIcon color="primary" />
                            </IconButton>
                            <IconButton onClick={handleClose}>
                                <CloseIcon color="primary" />
                            </IconButton>
                        </React.Fragment>
                    ) : (
                        <IconButton onClick={handleEdit}>
                            <EditIcon color="primary" sx={{fontSize: '20px'}} />
                        </IconButton>
                    )}
            >
                <ListItemText
                    primary={label + ':'}
                    secondary={viewComponent}
                    slotProps={{secondary: {
                        component: 'div'
                    }}}
                />

            </ListItem>
            <Collapse in={edit} timeout="auto" unmountOnExit>
                <ListItem>
                    {editComponent}
                </ListItem>
            </Collapse>
        </List>
    );
};

ViewEditFields.propTypes = {
    canEdit: PropTypes.bool.isRequired,
    editComponent: PropTypes.element,
    label: PropTypes.string.isRequired,
    onSave: PropTypes.func,
    viewComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]).isRequired,
};

export default ViewEditFields;