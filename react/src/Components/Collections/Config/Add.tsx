import { withVlow } from 'vlow';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { ErrorMsg, SimpleModal } from '../../Utils';
import { AddCollectionTAG } from '../../../Constants/Tags';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const validation =  (name, collections) => {
    if (name.length === 0) {
        return 'is required';
    }
    if (collections.some((c) => c.name === name)) {
        return 'collection name is already in use';
    }
    return '';
};

const tag = AddCollectionTAG;

const Add = ({open, onClose, collections}: IThingsdbStore & Props) => {
    const [name, setName] = React.useState('');
    const [err, setErr] = React.useState('');

    React.useEffect(() => { // clean state
        if(open) {
            setName('');
            setErr('');
        }
    }, [open]);

    const handleOnChange = ({target}) => {
        const {value} = target;
        setName(value);
        setErr('');
    };

    const handleClickOk = () => {
        const e = validation(name, collections);
        setErr(e);
        if (!e) {
            ThingsdbActions.addCollection(name, tag, onClose);
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
                error={Boolean(err)}
                fullWidth
                helperText={err}
                id="name"
                label="Name"
                margin="dense"
                onChange={handleOnChange}
                spellCheck={false}
                type="text"
                value={name}
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

interface Props {
    open: boolean;
    onClose: () => void;
}
