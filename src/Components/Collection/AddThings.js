import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';

import AddEditContent from './AddEditContent';

const AddThings = ({child, parent, scope, thing}) => {

    return(
        <AddEditContent
            scope={scope}
            icon={<AddBoxIcon color="primary" />}
            isEdit={false}
            child={child}
            parent={parent}
            thing={thing}
        />
    );
};

AddThings.defaultProps = {
    thing: null,
},

AddThings.propTypes = {
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
    thing: PropTypes.any,
};

export default AddThings;
