import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';

import { EditProvider } from '../../../Utils';
import ThingActionsDialog from './ThingActionsDialog';

const ThingActions = ({
    child,
    parent,
    thing = null,
    scope,
    isRoot = false
}: Props) => {
    const [show, setShow] = React.useState(false);
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    return (
        <React.Fragment>
            <Button color="primary" onClick={handleClickOpen} variant="outlined" >
                {Object.entries(thing).length < 2 ? 'Add your first thing!' : 'Add'}
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

ThingActions.propTypes = {
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    isRoot: PropTypes.bool,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default ThingActions;


interface Props {
    [index: string]: any;
}
