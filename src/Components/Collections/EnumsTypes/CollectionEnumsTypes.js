/* eslint-disable react-hooks/exhaustive-deps */
import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import {CollectionTypesTAG} from '../../../constants';
import {EnumActions, EnumStore, TypeActions, TypeStore} from '../../../Stores';
import {EnumTypeChips} from '../CollectionsUtils/TypesEnumsUtils';
import {HarmonicCardHeader} from '../../Util';


const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const useStyles = makeStyles(theme => ({
    spacing: {
        paddingBottom: theme.spacing(1),
    },
}));

const tag = CollectionTypesTAG;

const CollectionEnumsTypes = ({scope, customTypes, enums}) => {
    const classes = useStyles();
    const types = [
        'str',
        'utf8',
        'raw',
        'bytes',
        'bool',
        'int',
        'pint',
        'nint',
        'uint',
        'float',
        'number',
        'thing',
        'any',
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
        '{any}',
        '{thing}',
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

    React.useEffect(()=>{
        handleRefreshTypes();
        handleRefreshEnums();
    },[]);

    const handleRefreshEnums = () => EnumActions.getEnums(scope, tag);
    const handleRefreshTypes = () => TypeActions.getTypes(scope, tag);

    const handleChange = (a) => (n, c) => {
        if (c=='type') {
            setViewEnum({...viewEnum, [a]: false, name: ''});
            setViewType({...viewType, [a]: true, expand: true, name: n});
        } else {
            setViewType({...viewType, [a]: false, name: ''});
            setViewEnum({...viewEnum, [a]: true, expand: true, name: n});
        }
    };

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
            <Grid className={classes.spacing} item xs={12}>
                <HarmonicCardHeader expand={viewType.expand} onExpand={handleExpand('type')} title="TYPES" onRefresh={handleRefreshTypes} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: true, edit: true, run: false, view: false}}
                        categoryInit="type"
                        datatypes={datatypesMap}
                        items={customTypes[scope]}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={TypeActions.deleteType}
                        onInfo={TypeActions.getTypes}
                        scope={scope}
                        tag={tag}
                        view={viewType}
                    />
                </HarmonicCardHeader>
            </Grid>
            <Grid item xs={12}>
                <HarmonicCardHeader expand={viewEnum.expand} onExpand={handleExpand('enum')} title="ENUMS" onRefresh={handleRefreshEnums} unmountOnExit>
                    <EnumTypeChips
                        buttonsView={{add: true, edit: true, run: false, view: false}}
                        categoryInit="enum"
                        items={enums[scope]}
                        onChange={handleChange}
                        onClose={handleClose}
                        onDelete={EnumActions.deleteEnum}
                        onInfo={EnumActions.getEnums}
                        scope={scope}
                        tag={tag}
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