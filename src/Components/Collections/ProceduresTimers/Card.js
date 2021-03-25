import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import RunIcon from '@material-ui/icons/DirectionsRun';
import ViewIcon from '@material-ui/icons/Visibility';

import {ChipsCard} from '../../Util';


const Card = ({itemKey, onDialogs, list, onDelete, tag}) => {
    const [identifier, setIdentifier] = React.useState(null);

    const [open, setOpen] = React.useState({
        add: false,
        edit: false,
        run: false,
        view: false,
    });


    const handleClick = (type, ident) => () => {
        setIdentifier(ident);
        setOpen({...open, [type]: true});
    };

    const handleClickAdd = () => {
        setIdentifier(null);
        setOpen({...open, add: true});
    };

    const handleClose = (c) => {
        setOpen({...open, ...c});
    };

    const handleClickDelete = (ident, cb, tag) => {
        onDelete(ident, cb, tag);
    };

    const buttons = (ident) =>([
        {
            icon: <ViewIcon fontSize="small" />,
            onClick: handleClick('view', ident),
        },
        {
            icon: <RunIcon fontSize="small" />,
            onClick: handleClick('run', ident),
        },
        {
            icon:  <EditIcon fontSize="small" />,
            onClick: handleClick('edit', ident),
        },
    ]);

    return (
        <React.Fragment>
            <ChipsCard
                buttons={buttons}
                itemKey={itemKey}
                items={list}
                onAdd={handleClickAdd}
                onDelete={handleClickDelete}
                warnExpression={item => item.with_side_effects}
                tag={tag}
                title="procedures"
            />
            {onDialogs(identifier, open, handleClose)}
        </React.Fragment>
    );
};

Card.propTypes = {
    itemKey: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDialogs: PropTypes.func.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    tag: PropTypes.string.isRequired
};

export default Card;
