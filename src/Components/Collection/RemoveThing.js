import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogContentText from '@material-ui/core/DialogContentText';

import { ErrorMsg, SimpleModal } from '../Util';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';

const initialState = {
    show: false,
    serverError: '',
};

const RemoveThing = ({collection, thing, info}) => {
    const [state, setState] = React.useState(initialState);
    const {show, serverError} = state;

    const buildQuery = (p, ti, n, i) => {
        return i == null ? `t(${ti}).del('${n}')`
            : n == '$' ? `t(${ti}).${p}.remove(t(${ti}).${p}.find(|s| (s.id()==${thing['#']}) ))`
                : `t(${ti}).${n}.splice(${i}, 1)`;
    };


    const handleClickOpen = () => {
        setState({
            show: true,
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleClickOk = () => {
        const queryString = buildQuery(
            info.hasOwnProperty('parentName') ? info.parentName : null,
            info.id,
            info.name,
            info.hasOwnProperty('index') ? info.index : null
        );

        CollectionActions.rawQuery(
            collection.collection_id,
            info.id,
            queryString,
            (err) => setState({...state, serverError: err.log})
        );

        ThingsdbActions.getCollections((err) => setState({...state, serverError: err.log}));

        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
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
