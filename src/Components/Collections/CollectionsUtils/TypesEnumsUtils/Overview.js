/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {TableWithButtons} from '../../../Util';
import  UsedByType from './UsedByType';

const useStyles = makeStyles(theme => ({
    chips: {
        margin: theme.spacing(1),
    },
}));

const Overview = ({buttons, category, item, link, onAdd, onChangeItem, rows, scope}) => {
    const classes = useStyles();
    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyObject', label: category=='type'?'Type':'Value'},
    ];

    const handleAdd = () => {
        onAdd();
    };

    return (

        <React.Fragment>
            <ListItem>
                <ListItemText
                    primary="Current properties:"
                    secondary={
                        <Link target="_blank" href={link}>
                            {link}
                        </Link>
                    }
                />
            </ListItem>
            <ListItem>
                <TableWithButtons
                    header={header}
                    rows={rows}
                    rowClick={()=>null}
                    buttons={buttons}
                />
            </ListItem>
            <ListItem>
                <Grid container>
                    {onAdd && (
                        <Grid item xs={1}>
                            <Button onClick={handleAdd} >
                                <AddIcon color="primary" />
                            </Button>
                        </Grid>
                    )}
                    <Grid container item xs={onAdd?11:12} justify="flex-end">
                        <Box fontSize={10} fontStyle="italic" m={1}>
                            {`Created on: ${moment(item.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}${item.modified_at?`, last modified on: ${moment(item.modified_at*1000).format('YYYY-MM-DD HH:mm:ss')}`:''}`}
                        </Box>
                    </Grid>
                </Grid>
            </ListItem>
            <UsedByType name={item.name} onChangeItem={onChangeItem} scope={scope} />
        </React.Fragment>
    );
};

Overview.defaultProps = {
    buttons: null,
    item: {},
    onAdd: null,
    onChangeItem: ()=>null,
};

Overview.propTypes = {
    buttons: PropTypes.func,
    category: PropTypes.string.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onAdd: PropTypes.func,
    onChangeItem: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default Overview;
