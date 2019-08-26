import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';;
import TextField from '@material-ui/core/TextField';

import { CardButton, ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const quotaTypes = [
    'things',
    'properties',
    'array_size',
    'raw_size',
];

const initialState = {
    show: false,
    form: {},
    serverError: '',
};

const Quotas = ({collection}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form, serverError} = state;


    const _getQuota = (quotaType) => collection[`quota_${quotaType}`]||'';

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                quotaType: 'things',
                quota: _getQuota('things'),
            },
            serverError: '',
        });
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChangeType = ({target}) => {
        const {value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {quotaType: value, quota: _getQuota(value)});
            return {...prevState, form: updatedForm};
        });
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleUnset = () => {
        ThingsdbActions.setQuota(
            collection.name,
            form.quotaType,
            "nil",
            (err) => setState({...state, serverError: err.log})
        );

        if (!state.serverError) {
            setState({...state, show: false});
        }
    }

    const handleClickOk = () => {
        ThingsdbActions.setQuota(
            collection.name,
            form.quotaType,
            form.quota,
            (err) => setState({...state, serverError: err.log})
        );

        if (!state.serverError) {
            setState({...state, show: false});
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});
    }

    const Content =
        <React.Fragment>
            <ErrorMsg error={serverError} onClose={handleCloseError} />
            <TextField
                autoFocus
                margin="dense"
                id="quotaType"
                label="Type"
                value={form.quotaType}
                onChange={handleOnChangeType}
                fullWidth
                select
                SelectProps={{native: true}}
            >
                {quotaTypes.map(p => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
            </TextField>
            <TextField
                autoFocus
                margin="dense"
                id="quota"
                inputProps={{min: "1"}}
                label="Quota"
                type="number"
                value={form.quota}  // TODOK placeholder
                spellCheck={false}
                onChange={handleOnChange}
                fullWidth
            />
        </React.Fragment>
    ;

    return(
        <SimpleModal
            button={
                <CardButton onClick={handleClickOpen} title={'Quotas'} />
            }
            actionButtons={
                <Button onClick={handleUnset} color="primary">
                    {'Unset Quota'}
                </Button>
            }
            title={'Set quotas'}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

Quotas.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Quotas;