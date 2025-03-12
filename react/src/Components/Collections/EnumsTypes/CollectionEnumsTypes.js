import { withVlow } from 'vlow';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import React from 'react';

import { EnumsTAG, TypesTAG } from '../../../Constants/Tags';
import { EnumActions, EnumStore, TypeActions, TypeStore } from '../../../Stores';
import { EnumTypeChips } from './Utils';
import { HarmonicCardHeader } from '../../Utils';
import { ANY, BOOL, BYTES, CODE, CLOSURE, DATETIME, ERROR, FLOAT, INT, NINT, NUMBER, PINT, RAW, REGEX, ROOM,
    STR, THING, TIMEVAL, UINT, UTF8 } from '../../../Constants/ThingTypes';


const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const CollectionEnumsTypes = ({scope, customTypes, enums}) => {
    const types = [
        ANY,
        BOOL,
        BYTES,
        CODE,
        CLOSURE,
        DATETIME,
        ERROR,
        FLOAT,
        INT,
        NINT,
        NUMBER,
        PINT,
        RAW,
        REGEX,
        ROOM,
        STR,
        THING,
        TIMEVAL,
        UINT,
        UTF8,
        ...(customTypes[scope]||[]).map(c=>c.name),
        ...(enums[scope]||[]).map(c=>c.name)
    ];

    const typesOptional = [
        ...types,
        ...types.map(v=>`${v}?`),
    ];

    const list = [
        '[]',
        ...typesOptional.map(v=>`[${v}]`),
    ];

    const listOptional = [
        ...list,
        ...list.map(v=>`${v}?`),
    ];

    const set = [
        '{}',
        `{${ANY}}`,
        `{${THING}}`,
        ...(customTypes[scope]||[]).map(c=>`{${c.name}}`),
    ];

    const datatypesMap = [
        ...typesOptional,
        ...listOptional,
        ...set
    ];


    const [viewType, setViewType] = React.useState({
        add: false,
        edit: false,
        name: '',
        view: false,
        expand: false,
    });
    const [viewEnum, setViewEnum] = React.useState({
        add: false,
        edit: false,
        name: '',
        view:false,
        expand: false,
    });

    const handleRefreshEnums = React.useCallback(() => EnumActions.getEnums(scope, EnumsTAG), [scope]);
    const handleRefreshTypes = React.useCallback(() => TypeActions.getTypes(scope, TypesTAG), [scope]);

    React.useEffect(()=>{
        handleRefreshEnums();
        handleRefreshTypes();
    },[handleRefreshEnums, handleRefreshTypes]);

    const handleChange = React.useCallback((a) => (n, c) => {
        if (c=='type') {
            setViewEnum(viewEnum => ({...viewEnum, [a]: false, name: ''}));
            setViewType(viewType => ({...viewType, [a]: true, expand: true, name: n}));
        } else {
            setViewType(viewType => ({...viewType, [a]: false, name: ''}));
            setViewEnum(viewEnum => ({...viewEnum, [a]: true, expand: true, name: n}));
        }
    }, []);

    const handleClose = (a, c) => {
        if (c=='type') {
            setViewType({...viewType, [a]: false, name: ''});
        } else {
            setViewEnum({...viewEnum, [a]: false, name: ''});
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

    return (
        <React.Fragment>
            <Grid xs={12} sx={{paddingBottom: '8px'}}>
                <HarmonicCardHeader expand={viewType.expand} onExpand={handleExpand('type')} title="TYPES" onRefresh={handleRefreshTypes} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: true, cancel: false, edit: true, run: false, view: false}}
                        categoryInit="type"
                        items={customTypes[scope]}
                        datatypes={datatypesMap}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={TypeActions.deleteType}
                        onInfo={TypeActions.getTypes}
                        onRename={TypeActions.renameType}
                        scope={scope}
                        tag={TypesTAG}
                        view={viewType}
                    />
                </HarmonicCardHeader>
            </Grid>
            <Grid size={12}>
                <HarmonicCardHeader expand={viewEnum.expand} onExpand={handleExpand('enum')} title="ENUMS" onRefresh={handleRefreshEnums} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: true, cancel: false, edit: true, run: false, view: false}}
                        categoryInit="enum"
                        items={enums[scope]}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={EnumActions.deleteEnum}
                        onInfo={EnumActions.getEnums}
                        onRename={EnumActions.renameEnum}
                        scope={scope}
                        tag={EnumsTAG}
                        view={viewEnum}
                    />
                </HarmonicCardHeader>
            </Grid>
        </React.Fragment>
    );
};

CollectionEnumsTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
    /* enums properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(CollectionEnumsTypes);