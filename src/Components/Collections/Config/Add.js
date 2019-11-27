import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import {withVlow} from 'vlow';
import { makeStyles} from '@material-ui/core/styles';

import {ThingsdbActions, ThingsdbStore} from '../../../Stores';
import { ErrorMsg, SimpleModal } from '../../Util';

const withStores = withVlow([{
    store: ThingsdbStore,
    keys: ['collections']
}]);

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    buttonBase: {
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
    },
    icon: {
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        color: '#eee',
    },
}));

const initialState = {
    show: false,
    errors: {},
    form: {},
};

const tag = '4';

const Add = ({collections}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {show, errors, form} = state;

    const validation = {
        name: () => form.name.length>0&&collections.every((c) => c.name!==form.name),
    };

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
        const err = Object.keys(validation).reduce((d, ky) => { d[ky] = !validation[ky]();  return d; }, {});
        setState({...state, errors: err});
        if (!Object.values(err).some(d => d)) {
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
                <ButtonBase className={classes.buttonBase} onClick={handleClickOpen} >
                    <AddBoxIcon className={classes.icon} />
                </ButtonBase>
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