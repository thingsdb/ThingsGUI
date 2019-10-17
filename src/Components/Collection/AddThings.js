import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';

import AddEditContent from './AddEditContent';
import {buildInput, buildQueryAdd, onlyNums} from '../Util';

const AddThings = ({info, collection, thing}) => {
    const {id, name, type} = info;


    const errorTxt = (form) => ({
        queryString: () => '',
        newProperty: () => thing[form.newProperty] ? 'Property name already in use' : '',
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
        const propName = key=='newProperty' ? value : form.newProperty;
        const n = type == 'object' ? propName : name;

        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        const val = buildInput(input, dataType);
        return buildQueryAdd(id, n, val, type);

    };

    const query = type == 'set' ? buildQueryAdd(id, name, '{}', type): '';

    return(
        <AddEditContent
            collection={collection}
            errorTxt={errorTxt}
            handleBuildQuery={handleBuildQuery}
            icon={<AddBoxIcon color="primary" />}
            isEdit={false}
            info={info}
            init={{
                query: query,
                propName: '',
            }}
        />
    );
};

AddThings.defaultProps = {
    thing: null,
},

AddThings.propTypes = {
    info: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any,
};

export default AddThings;