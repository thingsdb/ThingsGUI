import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';

import {Tabs, TableExtra} from '../../../Util';
import  UsedByType from './UsedByType';


const Overview = ({badgeButton, buttons, headers, item, link, onAdd, onChangeItem, rows, scope}) => {

    const handleAdd = (kys) => () => {
        onAdd(kys);
    };

    const kys = Object.keys(headers);

    return (
        <React.Fragment>
            <ListItem>
                <ListItemText
                    primary="Current properties:"
                    secondary={
                        <Link target="_blank" href={link}>
                            {'ThingsDocs'}
                        </Link>
                    }
                />
            </ListItem>
            <Tabs
                headers={kys}
                panels={kys.map((v, i) => (
                    <TableExtra key={i} badgeButton={badgeButton} buttons={buttons} createdAt={item.created_at} header={headers[v]} modifiedAt={item.modified_at} onAdd={onAdd&&handleAdd(headers[v])} rows={rows[v]} />
                ))}
            />
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
    headers: PropTypes.object.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onAdd: PropTypes.func,
    onChangeItem: PropTypes.func,
    rows: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default Overview;
