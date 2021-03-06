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
import {STR, INT, FLOAT, THING, BYTES, CODE} from '../../../../../Constants/ThingTypes';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const PropertyVal = ({category, onChange, customTypes, enums, onBlob, scope}) => {
    const editState = useEdit()[0];
    const {val, blob} = editState;
    const [dataType, setDataType] = React.useState(STR);

    const allTypes = allDataTypes([...customTypes[scope]||[], ...enums[scope]||[]]);
    const dataTypes = category=='type'?allTypes: [STR, INT, FLOAT, THING, BYTES, CODE];

    React.useEffect(()=>{
        onChange({propertyVal:val});
        onBlob(blob);
    }, [val, blob]);

    const handleOnChangeType = (t) => {
        setDataType(t);
    };

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <TypeInit
                    onChange={handleOnChangeType}
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
    onChange: PropTypes.func.isRequired,
    onBlob: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(PropertyVal);


