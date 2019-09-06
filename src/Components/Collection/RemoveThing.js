import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogContentText from '@material-ui/core/DialogContentText';

import { buildQueryRemove, ErrorMsg, SimpleModal } from '../Util';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const tag = '4';
const RemoveThing = ({collection, thing, info}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        const queryString = buildQueryRemove(
            info.hasOwnProperty('parentName') ? info.parentName : null,
            info.id,
            info.name,
            info.hasOwnProperty('index') ? info.index : null,
            thing['#']
        );

        CollectionActions.rawQuery(
            collection.collection_id,
            info.id,
            queryString,
            tag,
            () => {
                ThingsdbActions.getCollections();
                setShow(false);
            }
        );
    };



    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
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
            title={`Remove ${info.name}`}
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
