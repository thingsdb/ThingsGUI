import {withVlow} from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';

import {ChipsCard} from '../../Util';
import {CollectionTypesTAG} from '../../../constants';
import {EnumActions, EnumStore, TypeActions, TypeStore} from '../../../Stores';
import {AddDialog, EditDialog} from '../CollectionsUtils/TypesEnumsUtils';


const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);


const tag = CollectionTypesTAG;

const CollectionEnums = ({customTypes, scope, enums}) => {
    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
    });
    const {add, edit} = open;

    const [name, setName] = React.useState('');
    React.useEffect(() => {
        EnumActions.getEnums(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        EnumActions.getEnums(scope, tag);
    };

    const handleClickEdit = (n) => () => {
        setName(n);
        setOpen({...open, edit: true});
    };
    const handleCloseEdit = () => {
        setOpen({...open, edit: false});
    };

    const handleClickAdd = () => {
        setName('');
        setOpen({...open, add: true});
    };
    const handleCloseAdd = () => {
        setOpen({...open, add: false});
    };
    const handleClickDelete = (n, cb, tag) => {
        EnumActions.deleteEnum(
            scope,
            n,
            tag,
            () => {
                cb();
            }
        );
    };

    const buttons = (n)=>([
        {
            icon: <img src="/img/view-edit.png" alt="view/edit" draggable="false" width="20" />,
            onClick: handleClickEdit(n),
        },
    ]);


    const enum_ = name&&enums[scope]?enums[scope].find(i=>i.name==name):{};
    const rows  = enum_.members? enum_.members.map(c=>({propertyName: c[0], propertyType: '', propertyObject: c[1], propertyVal: c[1]})):[];
    const usedBy = customTypes[scope]?customTypes[scope].filter(i=>
        `${i.fields},`.includes(`,${name},`) ||
        `${i.fields}`.includes(`,${name},`) ||
        `${i.fields}`.includes(`[${name}]`) ||
        `${i.fields}`.includes(`{${name}}`) ||
        `${i.fields}`.includes(`,${name}?`) ||
        `${i.fields}`.includes(`[${name}?]`) ||
        `${i.fields}`.includes(`{${name}?}`)
    ):[];

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={enums[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title="enums"
            />
            <AddDialog
                feature="enum"
                getInfo={(scope, tag)=>EnumActions.getEnums(scope, tag)}
                link="https://docs.thingsdb.net/v0/data-types/type/"
                onClose={handleCloseAdd}
                open={add}
                scope={scope}
            />
            <EditDialog
                feature="enum"
                getInfo={(scope, tag)=>EnumActions.getEnums(scope, tag)}
                item={enum_}
                link="https://docs.thingsdb.net/v0/data-types/type/"
                onClose={handleCloseEdit}
                open={edit}
                rows={rows}
                scope={scope}
                usedBy={usedBy}
            />
        </React.Fragment>
    );
};

CollectionEnums.propTypes = {
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,

    /* procedures properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(CollectionEnums);