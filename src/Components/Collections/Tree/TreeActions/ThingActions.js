import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import BuildIcon from '@material-ui/icons/Build';

import {EditProvider} from '../../CollectionsUtils';
import ThingActionsDialog from './ThingActionsDialog';

const ThingActions = ({child, parent, thing, scope, isRoot}) => {
    const [show, setShow] = React.useState(false);
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return (
        <React.Fragment>
            <Button color="primary" onClick={handleClickOpen} >
                <BuildIcon color="primary" />
            </Button>
            {show ? (
                <EditProvider>
                    <ThingActionsDialog
                        open={show}
                        onClose={handleClickClose}
                        child={child}
                        parent={parent}
                        thing={thing}
                        scope={scope}
                        isRoot={isRoot}
                    />
                </EditProvider>
            ) : null}
        </React.Fragment>
    );
};

ThingActions.defaultProps = {
    thing: null,
    isRoot: false,
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
    isRoot: PropTypes.bool,
};

export default ThingActions;
