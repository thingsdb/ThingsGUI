import PropTypes from 'prop-types';
import React from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';

import AddEditContent from './AddEditContent';
import {buildInput, buildQueryEdit, onlyNums} from '../Util';


const EditThing = ({info, collection, thing}) => {
    const {id, index, name, parentType} = info;

    const errorTxt = (form) => ({
        queryString: () => '',
        newProperty: () => form.newProperty == name ? '' : thing[form.newProperty] ? 'Property name already in use' : '',
        value: () => {
            const bool = form.value.length>0;
            let errText = bool?'':'Is required';

            if (bool && form.dataType == 'number') {
                errText = onlyNums(form.value) ? '' : 'only numbers';
            } else if (bool && form.dataType == 'closure') {
                // errText = form.value == 'true' || form.value == 'false' ? '' : 'not a boolean value';
            }
            return(errText);
        },
    });

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
            errorTxt={errorTxt}
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
    thing: PropTypes.any.isRequired,
};

export default EditThing;