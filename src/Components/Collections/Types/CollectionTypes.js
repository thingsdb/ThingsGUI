import {withVlow} from 'vlow';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';

import {AddTypeDialog} from './Dialogs';
import {TypeActions, TypeStore} from '../../../Stores';
import {ChipsCard, revealCustomType} from '../../Util';
import {CollectionTypesTAG} from '../../../constants';
import EditDialog from '../CollectionsUtils/TypesEnumsUtils/EditDialog';


const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = CollectionTypesTAG;

const CollectionTypes = ({scope, customTypes}) => {
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
        ...(customTypes[scope]||[]).map(c=>c.name)
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


    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
    });
    const {add, edit} = open;

    const [name, setName] = React.useState('');
    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

    }, [scope]);

    const handleRefresh = () => {
        TypeActions.getTypes(scope, tag);
    };

    const handleChangeType = (n) => () => {
        setName(n);
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
        TypeActions.deleteType(
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


    const addLink = (i, ctn) => {
        let t = revealCustomType(i);
        return( ctn.includes(t)? (
            <React.Fragment>
                {i.length-t.length>1?i[0]:null}
                <Link component="button" onClick={handleChangeType(t)}>
                    {t}
                </Link>
                {i.length-t.length>2?i.slice(t.length-i.length+1):i.length-t.length>0?i.slice(-1):null}
            </React.Fragment>
        ) : (i));
    };
    const customTypeNames=[...(customTypes[scope]||[]).map(c=>c.name)];
    const customType = name&&customTypes[scope]?customTypes[scope].find(i=>i.name==name):{};
    const rows = customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyObject: addLink(c[1], customTypeNames), propertyVal: ''})):[];
    const usedBy = customTypes[scope]?customTypes[scope].filter(i=>
        `${i.fields},`.includes(`,${customType.name},`) ||
        `${i.fields}`.includes(`,${customType.name},`) ||
        `${i.fields}`.includes(`[${customType.name}]`) ||
        `${i.fields}`.includes(`{${customType.name}}`) ||
        `${i.fields}`.includes(`,${customType.name}?`) ||
        `${i.fields}`.includes(`[${customType.name}?]`) ||
        `${i.fields}`.includes(`{${customType.name}?}`)
    ):[];
    console.log(customTypeNames, customType, rows, usedBy);
    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                expand={false}
                items={customTypes[scope]||[]}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                onRefresh={handleRefresh}
                title="custom types"
            />
            <AddTypeDialog
                open={add}
                onClose={handleCloseAdd}
                dataTypes={datatypesMap}
                scope={scope}
            />
            <EditDialog
                dataTypes={datatypesMap}
                feature="type"
                getInfo={(scope, tag)=>TypeActions.getTypes(scope, tag)}
                item={customType}
                onChangeItem={handleChangeType}
                onClose={handleCloseEdit}
                open={edit}
                rows={rows}
                scope={scope}
                usedBy={usedBy}
            />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    scope: PropTypes.string.isRequired,

    /* procedures properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);