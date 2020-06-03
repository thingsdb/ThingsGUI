import {makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import {TypeStore} from '../../../../Stores';

const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const useStyles = makeStyles(theme => ({
    chips: {
        margin: theme.spacing(1),
    },
}));

const UsedByType = ({customTypes, name, onChangeItem, scope}) => {
    const classes = useStyles();

    const pattern = "(?<=[{\\[,]|^)" + name + "(?=[}\\],?]|$)";
    const re= new RegExp(pattern)
    const u = customTypes[scope]?customTypes[scope].filter(i=>
        re.test(`${i.fields}`)
    ):[];

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
            <ListItem>
                {u.map((item, index)=>(
                    <Chip color="primary" className={classes.chips} key={index} onClick={handleChange(item.name, 'type')} label={item.name} size="small" />
                ))}
            </ListItem>
        </React.Fragment>
    ):null);
};

UsedByType.defaultProps = {
    name: '',
};

UsedByType.propTypes = {
    name: PropTypes.string,
    onChangeItem: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,

    /* types properties */
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(UsedByType);
