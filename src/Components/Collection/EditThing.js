import PropTypes from 'prop-types';
import React from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';

import AddEditContent from './AddEditContent';


const EditThing = ({child, parent, scope}) => {

    return(
        <AddEditContent
            scope={scope}
            icon={<EditIcon color="primary" />}
            isEdit
            child={child}
            parent={parent}
        />
    );
};

EditThing.propTypes = {
    child: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditThing;