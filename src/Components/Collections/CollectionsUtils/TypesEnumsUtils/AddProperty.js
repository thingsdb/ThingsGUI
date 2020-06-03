/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import {allDataTypes, AutoSelect} from '../../../Util';
import {useEdit} from '../Context';
import {EnumStore, TypeStore} from '../../../../Stores';
import InputField from '../InputField';
import TypeInit from '../../Tree/TreeActions/TypeInit';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const useStyles = makeStyles(theme => ({
    fullWidth: {
        width: '100%',
    },
}));

const AddProperty = ({category, cb, customTypes, dropdownItems, enums, hasInitVal, hasPropName, hasType, input, scope, hasVal}) => {
    const classes = useStyles();
    const {propertyName, propertyType} = input;
    const editState = useEdit()[0];
    const {val, blob} = editState;
    const [dataType, setDataType] = React.useState('str');
    const [switchIni, setSwitch] = React.useState(false);

    const allTypes = allDataTypes([...customTypes[scope]||[], ...enums[scope]||[]]);
    const dataTypes = category=='type'?allTypes: ['str', 'int', 'float', 'thing', 'bytes'];

    React.useEffect(()=>{
        if (hasVal) {
            cb({...input, propertyVal: val}, blob);
        } else {
            cb({...input, propertyVal: switchIni?val:null}, blob);
        }
    }, [val, switchIni]);

    const handleChange = ({target}) => {
        const {name, value} = target;
        cb({...input, [name]: value}, blob);
    };

    const handleType = (t) => {
        cb({...input, propertyType: t}, blob);
    };

    const handleOnChangeType = (t) => {
        setDataType(t);
    };

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitch(checked);
    };

    return (
        <Grid container item xs={12} spacing={1} alignItems="center" >
            {hasPropName ? (
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Name"
                        name="propertyName"
                        onChange={handleChange}
                        spellCheck={false}
                        type="text"
                        value={propertyName}
                        variant="standard"

                    />
                </Grid>
            ):null}
            {hasType ? (
                <Grid item xs={12}>
                    <AutoSelect cb={handleType} dropdownItems={dropdownItems} input={propertyType} label="Definition" />
                </Grid>
            ) : null}
            {hasVal ? (
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
                            // init={propertyVal==null?'':propertyVal}
                        />
                    </Grid>
                </React.Fragment>
            ) : hasInitVal ? (
                <React.Fragment>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={switchIni}
                                    color="primary"
                                    id="switchIni"
                                    onChange={handleSwitch}
                                />
                            )}
                            label="Add initial value or closure"
                        />
                    </Grid>
                    <Collapse className={classes.fullWidth} in={switchIni} timeout="auto" unmountOnExit>
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
                                // init={propertyVal==null?'':propertyVal}
                            />
                        </Grid>
                    </Collapse>
                </React.Fragment>
            ) : null}
        </Grid>
    );
};

AddProperty.defaultProps = {
    dropdownItems: [],
    hasInitVal: false,
    hasPropName: true,
    hasType: true,
    hasVal: false,
};

AddProperty.propTypes = {
    category: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
    dropdownItems: PropTypes.arrayOf(PropTypes.string),
    hasInitVal: PropTypes.bool,
    hasPropName: PropTypes.bool,
    hasType: PropTypes.bool,
    hasVal: PropTypes.bool,
    input: PropTypes.shape({propertyName: PropTypes.string.isRequired, propertyType:PropTypes.string.isRequired, propertyVal:PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])}).isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(AddProperty);


