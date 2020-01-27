import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles} from '@material-ui/core/styles';

import { ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions} from '../../../Stores';


const useStyles = makeStyles(theme => ({
    warning: {
        color: theme.palette.primary.red
    },
}));

const tag = '3';

const Remove = ({collection}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [name, setName] = React.useState(collection.name);
    const [switchDel, setSwitchDel] = React.useState(false);

    React.useEffect(() => {
        setName(collection.name);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
        setSwitchDel(false);
    };

    const handleClickClose = () => {
        setShow(false);

    };

    const handleClickOk = () => {
        ThingsdbActions.removeCollection(
            collection.name,
            tag,
            () => setShow(false)
        );
    };

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchDel(checked);
    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Remove'}
                </Button>
            }
            title={`Remove collection ${name}?`}
            open={show}
            actionButtons={
                <Button onClick={handleClickOk} disabled={!switchDel} className={classes.warning} >
                    {'Submit'}
                </Button>
            }
            onClose={handleClickClose}
            // classes={{paper: classes.background}}
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

Remove.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;