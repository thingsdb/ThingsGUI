import {withVlow} from 'vlow';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import React from 'react';

import {EnumStore, TypeStore} from '../../../../Stores';
import {revealCustomType} from '../../../Utils';

const withStores = withVlow([{
    store: EnumStore,
    keys: ['enums']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const AddLink = ({
    customTypes,
    enums,
    name = '',
    onChange,
    scope,
}: Props) => {
    const enumItems=[...(enums[scope]||[]).map(c=>(c.name))];
    const typeItems=[...(customTypes[scope]||[]).map(c=>c.name)];
    let stripped = revealCustomType(name);

    const handleChange = (name, category) => () => {
        onChange(name, category);
    };

    return( typeItems.includes(stripped)? (
        <React.Fragment>
            {name.length-stripped.length>1?name[0]:null}
            <Link component="button" onClick={handleChange(stripped, 'type')}>
                {stripped}
            </Link>
            {name.length-stripped.length>2?name.slice(stripped.length-name.length+1):name.length-stripped.length>0?name.slice(-1):null}
        </React.Fragment>
    ) : enumItems.includes(stripped)? (
        <React.Fragment>
            {name.length-stripped.length>1?name[0]:null}
            <Link component="button" onClick={handleChange(stripped, 'enum')}>
                {stripped}
            </Link>
            {name.length-stripped.length>2?name.slice(stripped.length-name.length+1):name.length-stripped.length>0?name.slice(-1):null}
        </React.Fragment>
    ): (name));
};

AddLink.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,

    /* enum properties */
    enums: EnumStore.types.enums.isRequired,
};

export default withStores(AddLink);

interface Props {
    name: string;
    onChange: any;
    scope: string;

    // TODOT stores
    customTypes: any[];
    enums: any[];
}
