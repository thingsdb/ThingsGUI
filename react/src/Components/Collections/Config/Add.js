import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { ErrorMsg, SimpleModal } from '../../Util';
import { AddCollectionTAG } from '../../../Constants/Tags';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const initialState = {
    errors: {},
    form: {},
};

const validation = {
    name: (f, collections) => {
        if (f.name.length==0) {
            return 'is required';
        }
        if (collections.some((c) => c.name===f.name)) {
            return 'collection name is already in use';
        }
        return '';
    },
};

const tag = AddCollectionTAG;

const Add = ({open, onClose, collections}) => {
    const [state, setState] = React.useState(initialState);
    const {errors, form} = state;

    React.useEffect(() => { // clean state
        setState(initialState);
    }, [open]);

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm, errors: {}};
        });
    };

    const handleClickOk = () => {
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form, collections);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            ThingsdbActions.addCollection(
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

    return(
        <SimpleModal
            title="New collection"
            open={open}
            onOk={handleClickOk}
            onClose={onClose}
            onKeyPress={handleKeyPress}
        >
            <ErrorMsg tag={tag} />
            <TextField
                autoFocus
                error={Boolean(errors.name)}
                fullWidth
                helperText={errors.name}
                id="name"
                label="Name"
                margin="dense"
                onChange={handleOnChange}
                spellCheck={false}
                type="text"
                value={form.name}
                variant="standard"
            />
        </SimpleModal>
    );
};

Add.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    /* collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Add);
