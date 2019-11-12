/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/AddCircle';

import ThingActionsDialog from './ThingActionsDialog';

const ThingActions = ({child, parent, thing, scope}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return (
        <React.Fragment>
            <ButtonBase onClick={handleClickOpen} >
                {/* <BuildIcon color="primary" /> */}
                <AddIcon color="primary" />
            </ButtonBase>
            {show ? (
                <ThingActionsDialog
                    open={show}
                    onClose={handleClickClose}
                    child={child}
                    parent={parent}
                    thing={thing}
                    scope={scope}
                />
            ) : null}
        </React.Fragment>
    );
};

ThingActions.defaultProps = {
    thing: null,
};

ThingActions.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

export default ThingActions;
