import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBoxOutlined';

import AddEditContent from './AddEditContent';
import {buildInput, buildQueryAdd} from '../Util';

const AddThings = ({info, collection, thing}) => {
    const {id, name, type} = info;

    const handleBuildQuery = (key, value, form) => {
        const propName = key=='newProperty' ? value : form.newProperty;
        const n = type == 'object' ? propName : name;

        const input = key=='value' ? value : form.value;
        const dataType = key=='dataType' ? value : form.dataType;
        console.log(input, dataType);
        const val = buildInput(input, dataType);
        return buildQueryAdd(id, n, val, type);

    };

    const query = type == 'set' ? buildQueryAdd(id, name, '{}', type): '';

    return(
        <AddEditContent
            collection={collection}
            handleBuildQuery={handleBuildQuery}
            icon={<AddBoxIcon color="primary" />}
            isEdit={false}
            info={info}
            init={{
                query: query,
                propName: '',
            }}
            thing={thing}
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