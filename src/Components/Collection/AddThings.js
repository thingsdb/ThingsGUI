import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';

import AddEditContent from './AddEditContent';

const AddThings = ({info, scope, thing}) => {

    return(
        <AddEditContent
            scope={scope}
            icon={<AddBoxIcon color="primary" />}
            isEdit={false}
            info={info}
            thing={thing}
        />
    );
};

AddThings.defaultProps = {
    thing: null,
},

AddThings.propTypes = {
    info: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    thing: PropTypes.any,
};

export default AddThings;