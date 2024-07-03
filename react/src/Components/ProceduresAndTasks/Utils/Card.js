import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@mui/icons-material/DirectionsRun';
import ViewIcon from '@mui/icons-material/Visibility';

import {ChipsCard, TableCard} from '../../Utils';


const Card = ({
    buttonsView,
    header = [],
    itemKey,
    list,
    onAdd,
    onClick,
    onDelete,
    tag,
}) => {
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
                icon: <EditIcon fontSize="small" />,
                onClick: onClick('edit', ident),
            });
        }
        if (bv.cancel) {
            b.push({
                icon:  <CancelIcon fontSize="small" />,
                onClick: onClick('cancel', ident),
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
