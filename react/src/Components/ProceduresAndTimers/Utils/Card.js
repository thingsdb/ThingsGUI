import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ChipsCard, TableCard} from '../../Util';


const Card = ({buttonsView, header, itemKey, list, onAdd, onClick, onDelete, tag}) => {
    const buttons = (bv) => (ident) => {
        let b = [];
        if (bv.view) {
            b.push({
                icon: <ViewIcon fontSize="small" />,
                onClick: onClick('view', ident),
            });
        }
        if (bv.run) {
            b.push({
                icon: <RunIcon fontSize="small" />,
                onClick: onClick('run', ident),
            });
        }
        if (bv.edit) {
            b.push({
                icon:  <EditIcon fontSize="small" />,
                onClick: onClick('edit', ident),
            });
        }

        return b;
    };

    return (itemKey === 'name' ? (
        <ChipsCard
            buttons={buttons(buttonsView)}
            itemKey={itemKey}
            items={list}
            onAdd={onAdd}
            onDelete={onDelete}
            warnExpression={item => item.with_side_effects}
            tag={tag}
            title={`${itemKey}s`}
        />
    ) : (
        <TableCard
            buttons={buttons(buttonsView)}
            header={header}
            itemKey={itemKey}
            items={list}
            onAdd={onAdd}
            onDelete={onDelete}
            tag={tag}
        />
    ));
};

Card.defaultProps = {
    header: [],
};

Card.propTypes = {
    buttonsView: PropTypes.object.isRequired,
    header: PropTypes.arrayOf(PropTypes.object),
    itemKey: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdd: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired
};

export default Card;