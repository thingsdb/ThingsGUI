import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { ErrorMsg, SimpleModal } from '../../Utils';
import {ThingsdbActions} from '../../../Stores';
import {QuotasTAG} from '../../../Constants/Tags';
import {NIL} from '../../../Constants/ThingTypes';

const quotaTypes = [
    'things',
    'properties',
    'array_size',
    'raw_size',
];

const initialState = {
    show: false,
    form: {},
};

const tag = QuotasTAG;

const Quotas = ({collection}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form} = state;


    const _getQuota = (quotaType) => collection[`quota_${quotaType}`]||'';

    const handleClickOpen = () => {
        setState({
            show: true,
            errors: {},
            form: {
                quotaType: 'things',
                quota: _getQuota('things'),
            },
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
            NIL,
            tag,
            () => setState({...state, show: false})
        );
    };

    const handleClickOk = () => {
        ThingsdbActions.setQuota(
            collection.name,
            form.quotaType,
            form.quota,
            tag,
            () => setState({...state, show: false})
        );
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
                fullWidth
                id="quotaType"
                label="Type"
                margin="dense"
                onChange={handleOnChangeType}
                select
                SelectProps={{native: true}}
                value={form.quotaType}
                variant="standard"
            >
                {quotaTypes.map(p => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
            </TextField>
            <TextField
                autoFocus
                fullWidth
                id="quota"
                inputProps={{min: '1'}}
                label="Quota"
                margin="dense"
                onChange={handleOnChange}
                spellCheck={false}
                type="number"
                value={form.quota}
                variant="standard"
            />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Quotas'}
                </Button>
            }
            actionButtons={
                <Button onClick={handleUnset} color="primary">
                    {'Unset Quota'}
                </Button>
            }
            title="Set quotas"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
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