/* eslint-disable react/no-multi-comp */
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import {Tabs, TableExtra} from '../../../Util';
import  UsedByType from './UsedByType';
import Methods from './Methods';


const Overview = ({badgeButton, buttons, category, item, link, onAdd, onChangeItem, rows, scope}) => {
    const header1 = [
        {ky: 'default', label: 'Default'},
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyObject', label: category=='type'?'Type':'Value'},
    ];

    const header2 = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'definition', label: 'Definition'},
    ];

    const rows2 = Object.entries(item.methods||{}).reduce((res, k) => {res.push({propertyName: k[0], definition: k[1].definition}); return res;},[]);

    const handleAdd = (ky) => () => {
        onAdd(ky);
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
            {category === 'type' ? (
                <Tabs headers={["Fields", "Methods"]} panels={[
                    <TableExtra badgeButton={badgeButton} buttons={buttons} createdAt={item.created_at} header={header1} modifiedAt={item.modified_at} onAdd={handleAdd('Fields')} rows={rows} />,
                    <TableExtra badgeButton={badgeButton} buttons={buttons} createdAt={item.created_at} header={header2} modifiedAt={item.modified_at} onAdd={handleAdd('Methods')} rows={rows2} />
                ]} />
            ) : category === 'enum'? (
                <ListItem>
                    <TableExtra badgeButton={badgeButton} buttons={buttons} createdAt={item.created_at} header={header1} modifiedAt={item.modified_at} onAdd={handleAdd('Fields')} rows={rows} />
                </ListItem>
            ) :null}
            <UsedByType name={item.name} onChangeItem={onChangeItem} scope={scope} />
        </React.Fragment>
    );
};

Overview.defaultProps = {
    badgeButton: null,
    buttons: null,
    item: {},
    onAdd: null,
    onChangeItem: ()=>null,
};

Overview.propTypes = {
    badgeButton: PropTypes.func,
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
