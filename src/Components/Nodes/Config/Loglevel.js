import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';


const loglevels = [
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'CRITICAL',
];

const initialState = {
    show: false,
    form: {},
};

const tag = '15';

const Loglevel = ({node}) => {
    const [state, setState] = React.useState(initialState);
    const {show, form} = state;

    const handleClickOpen = () => {
        setState({show: true, form: {...node}});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {id, value} = target;
        setState(prevState => {
            const updatedForm = Object.assign({}, prevState.form, {[id]: value});
            return {...prevState, form: updatedForm};
        });
    };

    const handleClickOk = () => {
        NodesActions.setLoglevel(
            node.node_id,
            form.log_level,
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
                margin="dense"
                id="log_level"
                label="Loglevel"
                value={form.log_level}
                onChange={handleOnChange}
                fullWidth
                select
                SelectProps={{native: true}}
            >
                {loglevels.map(p => (
                    <option key={p} value={p}>
                        {p.toLowerCase()}
                    </option>
                ))}
            </TextField>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    {'Loglevel'}
                </Button>
            }
            title="Set Loglevel"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Loglevel.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Loglevel;