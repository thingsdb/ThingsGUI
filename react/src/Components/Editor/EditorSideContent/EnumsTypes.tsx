import  {withVlow } from 'vlow';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { EnumActions, TypeActions, EnumStore, TypeStore } from '../../../Stores';
import { EnumsTAG, TypesTAG } from '../../../Constants/Tags';
import { EnumTypeChips } from '../../Collections/EnumsTypes/Utils';
import { HarmonicCardHeader, WarnPopover } from '../../Utils';
import { CUSTOM_TYPE_FORMAT_QUERY, SET_ENUM_EMPTY_QUERY, SET_TYPE_EMPTY_QUERY } from '../../../TiQueries/Queries';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const EnumsTypes = ({customTypes, enums, onSetQueryInput, scope}) => {
    const [viewEnum, setViewEnum] = React.useState({
        open: false,
        name: '',
        expand: false,
    });
    const [viewType, setViewType] = React.useState({
        open: false,
        name: '',
        expand: false,
    });

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');

    const handleRefreshEnums = React.useCallback(() => EnumActions.getEnums(scope, EnumsTAG), [scope]);
    const handleRefreshTypes = React.useCallback(() => TypeActions.getTypes(scope, TypesTAG), [scope]);

    React.useEffect(() => {
        handleRefreshTypes();
        handleRefreshEnums();
    }, [handleRefreshEnums, handleRefreshTypes,]);

    const makeTypeInstanceInit = (n, customTypeNames, customTypes, circularRefFlag, target) => {
        if (customTypeNames.includes(n)) {
            if (circularRefFlag[n]) {
                setAnchorEl(target);
                setWarnDescription('Circular reference detected');
                return '';
            } else {
                circularRefFlag[n] = true;
                let content = customTypes.find(i=>i.name==n).fields.map(c => `${c[0]}: ${makeTypeInstanceInit(c[1], customTypeNames, customTypes, {...circularRefFlag}, target)}`);
                return CUSTOM_TYPE_FORMAT_QUERY(n, content);
            }
        }
        return `<${n}>`;
    };
    const makeEnumInstanceInit = (n)  => {
        return CUSTOM_TYPE_FORMAT_QUERY(n, '...');
    };

    const handleChange = React.useCallback((a) => (n, c) => {
        switch(a){
        case 'view':
            if (c=='type') {
                setViewEnum(viewEnum => ({...viewEnum, open: false, name: ''}));
                setViewType({open: true, expand: true, name: n});
            } else {
                setViewType(viewType => ({...viewType, open: false, name: ''}));
                setViewEnum({open: true, expand: true, name: n});
            }
            break;
        case 'add':
            if (c=='type') {
                onSetQueryInput(SET_TYPE_EMPTY_QUERY);
            } else {
                onSetQueryInput(SET_ENUM_EMPTY_QUERY);
            }
            break;
        }
    }, [onSetQueryInput]);

    const handleClose = (_a, c) => {
        if (c=='type') {
            setViewType({...viewType, open: false, name: ''});
        } else {
            setViewEnum({...viewEnum, open: false, name: ''});
        }
    };

    const handleExpand = (ky) => (check) => {
        switch(ky){
        case 'type':
            setViewType({...viewType, expand: check});
            break;
        case 'enum':
            setViewEnum({...viewEnum, expand: check});
            break;
        }
    };

    const handleCloseWarn = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseWarn} description={warnDescription} />
            <Grid size={12}>
                <HarmonicCardHeader expand={viewType.expand} onExpand={handleExpand('type')} title="TYPES" onRefresh={handleRefreshTypes} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: false, cancel: false, edit: false, run: true, view: true}}
                        categoryInit="type"
                        items={customTypes[scope]}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={TypeActions.deleteType}
                        onInfo={TypeActions.getTypes}
                        onMakeInstanceInit={makeTypeInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={TypesTAG}
                        view={{view: viewType.open, name: viewType.name}}
                    />
                </HarmonicCardHeader>
            </Grid>
            <Grid size={12}>
                <HarmonicCardHeader expand={viewEnum.expand} onExpand={handleExpand('enums')} title="ENUMS" onRefresh={handleRefreshEnums} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: false, cancel: false, edit: false, run: true, view: true}}
                        categoryInit="enum"
                        items={enums[scope]}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={EnumActions.deleteEnum}
                        onInfo={EnumActions.getEnums}
                        onMakeInstanceInit={makeEnumInstanceInit}
                        onSetQueryInput={onSetQueryInput}
                        scope={scope}
                        tag={EnumsTAG}
                        view={{view: viewEnum.open, name: viewEnum.name}}
                    />
                </HarmonicCardHeader>
            </Grid>
        </React.Fragment>

    );
};

EnumsTypes.propTypes = {
    onSetQueryInput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(EnumsTypes);