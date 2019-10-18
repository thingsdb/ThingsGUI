import PropTypes from 'prop-types';
import React from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';

import AddEditContent from './AddEditContent';
import {buildInput, buildQueryEdit} from '../Util';


const EditThing = ({info, collection}) => {
    const {id, index, name, parentType} = info;

    const handleBuildQuery = (key, value, form) => {
        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        const val = buildInput(input, dataType);
        return buildQueryEdit(id, name, val, parentType, index);

    };

    const query = parentType == 'set' ? buildQueryEdit(id, name, '{}', parentType, index): '';
    return(
        <AddEditContent
            collection={collection}
            handleBuildQuery={handleBuildQuery}
            icon={<EditIcon color="primary" />}
            isEdit
            info={info}
            init={{
                query: query,
                propName: name,
            }}
        />
    );
};

EditThing.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
};

export default EditThing;