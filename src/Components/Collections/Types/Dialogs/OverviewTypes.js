/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import {revealCustomType, TableWithButtons} from '../../../Util';

const useStyles = makeStyles(theme => ({
    chips: {
        margin: theme.spacing(1),
    },
}));

const OverviewTypes = ({buttons, customType, customTypes, onChangeType}) => {
    const classes = useStyles();
    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyTypeObject', label: 'Type'},
    ];

    const handleClickCustomType = (i) => () => {
        onChangeType(i);
    };
    const addLink = (i, ctn) => {
        let t = revealCustomType(i);
        return( ctn.includes(t)? (
            <React.Fragment>
                {i.length-t.length>1?i[0]:null}
                <Link component="button" onClick={handleClickCustomType(t)}>
                    {t}
                </Link>
                {i.length-t.length>2?i.slice(i.length-t.length, -1):i.length-t.length>0?i.slice(-1):null}
            </React.Fragment>
        ) : (i));
    };
    const customTypeNames=[...(customTypes||[]).map(c=>c.name)];
    const rows = customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyTypeObject: addLink(c[1], customTypeNames), propertyVal: ''})):[];
    const usedBy = customTypes.filter(i=>
        `${i.fields},`.includes(`,${customType.name},`) ||
        `${i.fields}`.includes(`,${customType.name},`) ||
        `${i.fields}`.includes(`[${customType.name}]`) ||
        `${i.fields}`.includes(`{${customType.name}}`) ||
        `${i.fields}`.includes(`,${customType.name}?`) ||
        `${i.fields}`.includes(`[${customType.name}?]`) ||
        `${i.fields}`.includes(`{${customType.name}?}`)
    );
    return (

        <React.Fragment>
            <ListItem>
                <ListItemText
                    primary="Current properties:"
                    secondary={
                        <Link target="_blank" href="https://docs.thingsdb.net/v0/data-types/type/">
                            {'https://docs.thingsdb.net/v0/data-types/type/'}
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
                    <Grid container item xs={11} justify="flex-end">
                        <Box fontSize={10} fontStyle="italic" m={1}>
                            {`Created on: ${moment(customType.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}, last modified on: ${moment(customType.modified_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                        </Box>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <ListItemText
                    primary="Part of type:"
                />
            </ListItem>
            <ListItem>
                {usedBy.map((item, index)=>(
                    <Chip className={classes.chips} key={index} onClick={handleClickCustomType(item.name)} label={item.name} size="small" />
                ))}
            </ListItem>
        </React.Fragment>
    );
};

OverviewTypes.defaultProps = {
    buttons: null,
    customType: {},
};

OverviewTypes.propTypes = {
    buttons: PropTypes.func,
    onChangeType: PropTypes.func.isRequired,
    customType: PropTypes.object,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default OverviewTypes;
