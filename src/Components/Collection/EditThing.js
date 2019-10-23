import PropTypes from 'prop-types';
import React from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';

import AddEditContent from './AddEditContent';


const EditThing = ({info, scope}) => {

    return(
        <AddEditContent
            scope={scope}
            icon={<EditIcon color="primary" />}
            isEdit
            info={info}
        />
    );
};

EditThing.propTypes = {
    info: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditThing;