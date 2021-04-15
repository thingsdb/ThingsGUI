import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles} from '@material-ui/core/styles';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';
import {ShutdownTAG} from '../../../Constants/Tags';

const useStyles = makeStyles(theme => ({
    warning: {
        color: theme.palette.primary.red
    },
}));

const tag = ShutdownTAG;

const Shutdown = ({node}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [switchDel, setSwitchDel] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
        setSwitchDel(false);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.shutdown(
            node.node_id,
            tag,
            () => setShow(false));
    };

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchDel(checked);
    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Shutdown'}
                </Button>
            }
            title="Shutdown node?"
            open={show}
            actionButtons={
                <Button color="primary" onClick={handleClickOk} disabled={!switchDel} className={classes.warning} >
                    {'Submit'}
                </Button>
            }
            onClose={handleClickClose}
        >
            <React.Fragment>
                <ErrorMsg tag={tag} />
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchDel}
                            color="primary"
                            id="description"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Are you really sure?"
                />
            </React.Fragment>
        </SimpleModal>
    );
};

Shutdown.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Shutdown;