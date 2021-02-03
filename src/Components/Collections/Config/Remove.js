import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles} from '@material-ui/core/styles';

import { ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions} from '../../../Stores';
import {RemoveCollectionTAG} from '../../../constants';


const useStyles = makeStyles(theme => ({
    warning: {
        color: theme.palette.primary.red
    },
}));

const tag = RemoveCollectionTAG;

const Remove = ({collection, close}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const name = React.useState(collection.name)[0]; //to prevent update of name to undefined, after it is deleted.
    const [switchDel, setSwitchDel] = React.useState(false);

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
            close?handleClickClose:()=>null,
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

Remove.defaultProps = {
    close: false,
};

Remove.propTypes = {
    close: PropTypes.bool,

    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;