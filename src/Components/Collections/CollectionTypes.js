import React from 'react';
import PropTypes from 'prop-types';
import {withVlow} from 'vlow';

import TypesDialog from './TypesDialog';
import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {ChipsCard} from '../Util';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = '21';

const CollectionTypes = ({collection, customTypes}) => {
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState(null);
    React.useEffect(() => {
        TypeActions.getTypes(`@collection:${collection.name}`, tag);

    }, [collection]);

    const handleClick = (k) => {
        setType(k);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickAdd = () => {
        setOpen(true);
    };

    const handleClickDelete = (k) => () => {
        console.log('delete');
    };

    const typesArr = [...Object.keys(customTypes).map((name) => (
        {
            name: name,
            definition: JSON.stringify(customTypes[name])
        }
    ))];

    return (
        <React.Fragment>
            <ChipsCard
                title="custom types"
                items={typesArr}
                onAdd={handleClickAdd}
                onClick={handleClick}
                onDelete={handleClickDelete}
            />
            <TypesDialog open={open} onClose={handleClose} customType={null} customTypes={customTypes} collection={collection} />
        </React.Fragment>
    );
};

CollectionTypes.propTypes = {
    collection: PropTypes.object.isRequired,

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(CollectionTypes);