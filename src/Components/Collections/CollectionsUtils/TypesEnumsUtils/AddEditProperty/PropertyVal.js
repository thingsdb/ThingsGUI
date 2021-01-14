/* eslint-disable react-hooks/exhaustive-deps */
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import {allDataTypes} from '../../../../Util';
import {useEdit} from '../../Context';
import {EnumStore, TypeStore} from '../../../../../Stores';
import InputField from '../../InputField';
import TypeInit from '../../../Tree/TreeActions/TypeInit';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const PropertyVal = ({category, cb, customTypes, enums, onBlob, scope}) => {
    const editState = useEdit()[0];
    const {val, blob} = editState;
    const [dataType, setDataType] = React.useState('str');

    const allTypes = allDataTypes([...customTypes[scope]||[], ...enums[scope]||[]]);
    const dataTypes = category=='type'?allTypes: ['str', 'int', 'float', 'thing', 'bytes', 'code'];

    React.useEffect(()=>{
        cb({propertyVal:val});
        onBlob(blob);
    }, [val]);

    const handleOnChangeType = (t) => {
        setDataType(t);
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <TypeInit
                    cb={handleOnChangeType}
                    type={''}
                    customTypes={customTypes[scope]||[]}
                    dataTypes={dataTypes}
                    input={dataType}
                />
            </Grid>
            <Grid item xs={12}>
                <InputField
                    dataType={dataType}
                    enums={enums[scope]||[]}
                    margin="dense"
                    customTypes={customTypes[scope]||[]}
                    dataTypes={allTypes}
                    label="Value"
                    fullWidth
                />
            </Grid>
        </React.Fragment>
    );
};

PropertyVal.propTypes = {
    category: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(PropertyVal);


