import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {withVlow} from 'vlow';

import { ErrorMsg, SimpleModal } from '../../Util';
import {ThingsdbActions, ThingsdbStore} from '../../../Stores';
import {RenameCollectionTAG} from '../../../Constants/Tags';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const initialState = {
    show: false,
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

const tag = RenameCollectionTAG;

const Rename = ({collection, collections}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {...collection},
        });
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
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = validation[ky](form, collections);  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => Boolean(d))) {
            ThingsdbActions.renameCollection(
                collection.name,
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
                error={Boolean(errors.name)}
                helperText={errors.name}
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Rename'}
                </Button>
            }
            title="Rename Collection"
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
    collection: PropTypes.object.isRequired,

    /* collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Rename);