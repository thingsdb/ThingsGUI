import { withVlow } from 'vlow';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import { TypeStore } from '../../../../Stores';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const UsedByType = ({
    customTypes,
    name = '',
    onChangeItem,
    scope,
}: Props) => {
    const pattern = '\\b' + name + '\\b';
    const re= new RegExp(pattern);
    const u = customTypes[scope] && name ? customTypes[scope].filter(i => re.test(`${i.fields}`)) : [];

    const handleChange = (name, category) => () => {
        onChangeItem(name, category);
    };

    return(u.length ? (
        <React.Fragment>
            <ListItem>
                <ListItemText
                    primary="Part of type:"
                />
            </ListItem>
            <Grid>
                {u.map((item, index) => (
                    <Chip
                        color="primary"
                        key={index}
                        label={item.name}
                        onClick={handleChange(item.name, 'type')}
                        size="small"
                        sx={{margin: '8px', color: '#000'}}
                    />
                ))}
            </Grid>
        </React.Fragment>
    ) : null);
};

UsedByType.propTypes = {
    name: PropTypes.string,
    onChangeItem: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(UsedByType);


interface Props {
    name: string;
    onChangeItem: any;
    scope: string;

    // TODOT stores
    customTypes: any[];
}
