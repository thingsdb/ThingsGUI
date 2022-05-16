/* eslint-disable react-hooks/exhaustive-deps */
import {withVlow} from 'vlow';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import {allDataTypes, InputField, useEdit} from '../../../../Utils';
import {EnumStore, TypeStore} from '../../../../../Stores';
import TypeInit from '../../../Tree/TreeActions/TypeInit';
import {STR, INT, FLOAT, BYTES} from '../../../../../Constants/ThingTypes';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const PropertyVal = ({category, onChange, customTypes, enums, scope}) => {
    const editState = useEdit()[0];
    const {val, blob} = editState;
    const [dataType, setDataType] = React.useState(STR);

    const allTypes = allDataTypes([...customTypes[scope]||[], ...enums[scope]||[]]);
    const dataTypes = category == 'type' ? allTypes : [STR, INT, FLOAT, BYTES];

    React.useEffect(()=>{
        onChange({propertyVal: [INT, FLOAT].includes(dataType) ? Number(val) : val, propertyBlob: blob});
    }, [val, blob]);

    const handleOnChangeType = (t) => {
        setDataType(t);
    };

    return (
        <React.Fragment>
            <Grid item xs={6}>
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
                    variant="standard"
                    fullWidth
                />
            </Grid>
        </React.Fragment>
    );
};

PropertyVal.propTypes = {
    category: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(PropertyVal);


