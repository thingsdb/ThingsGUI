import { styled } from '@mui/material/styles';
import { withVlow } from 'vlow';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import React from 'react';
import TextField from '@mui/material/TextField';

import { ThingsdbActions, ThingsdbStore } from '../../../Stores';
import { ErrorMsg, SimpleModal } from '../../Util';
import { AddCollectionTAG } from '../../../Constants/Tags';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: 0,
    justifyContent: 'left',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:hover': {
        backgroundColor: '#303030',
    },
    text: 'italic',
}));

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

const tag = AddCollectionTAG;

const Add = ({collections}) => {
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;


    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                name: '',
            },
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
                <StyledButton color="primary" onClick={handleClickOpen} >
                    <AddBoxIcon color="primary" sx={{marginTop: '4px', marginBottom: '4px'}} />
                </StyledButton>
            }
            title="New collection"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Add.propTypes = {

    /* collections properties */
    collections: ThingsdbStore.types.collections.isRequired,
};

export default withStores(Add);
