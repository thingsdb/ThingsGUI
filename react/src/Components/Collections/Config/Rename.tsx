import { useLocation, useNavigate } from 'react-router';
import { withVlow } from 'vlow';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ErrorMsg, historyNavigate, SimpleModal } from '../../Utils';
import { RenameCollectionTAG } from '../../../Constants/Tags';
import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { COLLECTION_ROUTE } from '../../../Constants/Routes';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const initialState: State = {
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

const Rename = ({collection, collections}: IThingsdbStore & Props) => {
    const [state, setState] = React.useState(initialState);
    let navigate = useNavigate();
    let location = useLocation();

    const {show, errors, form} = state;

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {...collection},
        });
    };

    const handleClickClose = () => {
        setState(state => ({...state, show: false}));
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
        setState(state => ({...state, errors: err}));
        if (!Object.values(err).some(d => Boolean(d))) {
            ThingsdbActions.renameCollection(
                collection.name,
                form.name,
                tag,
                () => {
                    setState(state => ({...state, show: false}));
                    historyNavigate(navigate, location, `/${COLLECTION_ROUTE}/${form.name}`);
                }
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

interface Props {
    collection: ICollection;
}
interface State {
    show: boolean;
    errors: Partial<Record<keyof ICollection, string>>;
    form: Partial<ICollection>;
}