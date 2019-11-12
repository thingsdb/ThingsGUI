import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions, ThingsdbStore} from '../../Stores/ThingsdbStore';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['users']
}]);

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const tag = '18';

const Rename = ({user, users}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const validation = {
        name: () => form.name.length>0&&users.every((u) => u.name!==form.name),
    };

    const handleClickOpen = () => {
        setState({show: true, errors: {}, form: {...user}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
            ThingsdbActions.renameUser(
                user.name,
                form.name,
                tag,
                () => setState({...state, show: false})
            );
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };


    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={form.name}
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
                error={errors.name}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title="Rename" />
            }
            title="Rename user"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Rename.propTypes = {
    user: PropTypes.object.isRequired,

    /* application properties */
    users: ThingsdbStore.types.users.isRequired,
};

export default withStores(Rename);