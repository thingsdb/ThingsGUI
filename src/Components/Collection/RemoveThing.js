import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogContentText from '@material-ui/core/DialogContentText';

import { ErrorMsg, SimpleModal } from '../Util';
import CollectionActions from '../../Actions/CollectionActions';
import ThingsdbActions from '../../Actions/ThingsdbActions';

const thingsdbActions = new ThingsdbActions();
const collectionActions = new CollectionActions();


const RemoveThing = ({collection, thing, info}) => {
    const [show, setShow] = React.useState(false);

    const buildQuery = (p, ti, n, i) => {
        return i == null ? `t(${ti}).del('${n}')`
            : n == '$' ? `t(${ti}).${p}.remove(t(${ti}).${p}.find(|s| (s.id()==${thing['#']}) ))`
                : `t(${ti}).${n}.splice(${i}, 1)`;
    };


    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        const queryString = buildQuery(
            info.hasOwnProperty('parentName') ? info.parentName : null,
            info.id,
            info.name,
            info.hasOwnProperty('index') ? info.index : null
        );

        collectionActions.rawQuery(
            collection.collection_id,
            info.id,
            queryString,
        );

        thingsdbActions.getCollections();
        setShow(false);

    };

    const Content = (
        <React.Fragment>
            {/* <ErrorMsg error={serverError} onClose={handleCloseError} /> */}
            <DialogContentText>
                {'Are you sure?'}
            </DialogContentText>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen} >
                    <DeleteIcon color="primary" />
                </ButtonBase>
            }
            title="Remove Thing"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

RemoveThing.propTypes = {
    collection: PropTypes.object.isRequired,
    thing: PropTypes.any.isRequired,
    info: PropTypes.object.isRequired,
};

export default RemoveThing;
