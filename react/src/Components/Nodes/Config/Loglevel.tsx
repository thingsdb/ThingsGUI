import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { ErrorMsg, SimpleModal } from '../../Utils';
import {NodesActions} from '../../../Stores';
import {LoglevelTAG} from '../../../Constants/Tags';

const logLevels = [
    {
        ky: 'debug',
        label: 'DEBUG',
        value: 0,
    },
    {
        ky: 'info',
        label: 'INFO',
        value: 1,
    },
    {
        ky: 'warning',
        label: 'WARNING',
        value: 2,
    },
    {
        ky: 'error',
        label: 'ERROR',
        value: 3,
    },
    {
        ky: 'critical',
        label: 'CRITICAL',
        value: 4,
    },
];

const initialState = {
    show: false,
    logLevel: 0,
};

const tag = LoglevelTAG;

const Loglevel = ({node}: Props) => {
    const [state, setState] = React.useState(initialState);
    const {show, logLevel} = state;

    const handleClickOpen = () => {
        const l = logLevels.find(l => l.label === node.log_level);
        setState({show: true, logLevel: l ? l.value : logLevels[0].value});
    };

    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleOnChange = ({target}) => {
        const {value} = target;
        setState(prevState => ({...prevState, logLevel: value}));
    };

    const handleClickOk = () => {
        NodesActions.setLoglevel(
            node.node_id,
            Number(logLevel),
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
                id="log_level"
                label="Loglevel"
                margin="dense"
                onChange={handleOnChange}
                select
                slotProps={{select: {native: true}}}
                value={logLevel}
                variant="standard"
            >
                {logLevels.map(l => (
                    <option key={l.ky} value={l.value}>
                        {l.label}
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

interface Props {
    node: INode;
}