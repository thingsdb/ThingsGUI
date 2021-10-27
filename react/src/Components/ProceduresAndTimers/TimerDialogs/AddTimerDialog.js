import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {CollectionActions, TimerActions} from '../../../Stores';
import {Closure, ErrorMsg, SimpleModal, SwitchOpen, TimePicker, TimePeriodPicker, VariablesArray} from '../../Utils';
import {AddTimerDialogTAG} from '../../../Constants/Tags';
import {THINGS_DOC_NEW_TIMER} from '../../../Constants/Links';
import {NIL} from '../../../Constants/ThingTypes';


const tag = AddTimerDialogTAG;

const initState = {
    args: [],
    closure: '',
    error: '',
    queryString: 'new_timer()',
    repeat: NIL,
    start: null,
};

const AddTimerDialog = ({open, onClose, scope}) => {
    const [state, setState] = React.useState(initState);
    const {args, closure, error, queryString, repeat, start} = state;


    React.useEffect(() => { // clean state
        setState(initState);
    }, [open]);

    const handleChangeStart = (s) => {
        setState({...state, start: s, queryString: `new_timer(datetime(${s}), ${repeat}, ${closure}${args.length ? `, [${args}]`: ''})`});
    };

    const handleChangeRepeat = (r) => {
        setState({...state, repeat: r, queryString: `new_timer(datetime(${start}), ${r}, ${closure}${args.length ? `, [${args}]`: ''})`});
    };

    const handleChangeClosure = (c) => {
        setState({...state, closure: c, queryString: `new_timer(datetime(${start}), ${repeat}, ${c}${args.length ? `, [${args}]`: ''})`});
    };

    const handleChangeArgs = (a) => {
        setState({...state, args: a, queryString: `new_timer(datetime(${start}), ${repeat}, ${closure}${a.length ? `, [${a}]`: ''})`});
    };

    const handleSwitchRepeat = (open) => {
        if(!open) {
            handleChangeRepeat(NIL);
        }
    };

    const handleSwitchArgs = (open) => {
        if(!open) {
            handleChangeArgs([]);
        }
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            queryString,
            tag,
            () => {
                TimerActions.getTimers(scope, tag);
                onClose();
            }
        );
    };

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
            disableOk={Boolean(error)}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB timer:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {'Add new timer'}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <ListItem>
                            <ListItemText
                                primary="For more information, see:"
                                secondary={
                                    <Link target="_blank" href={THINGS_DOC_NEW_TIMER}>
                                        {'ThingsDocs'}
                                    </Link>
                                }
                            />
                        </ListItem>
                        <Collapse in={Boolean(queryString)} timeout="auto">
                            <ListItem>
                                <TextField
                                    fullWidth
                                    label="Query"
                                    maxRows="10"
                                    multiline
                                    name="queryString"
                                    type="text"
                                    value={queryString}
                                    variant="standard"
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    inputProps={{
                                        style: {
                                            fontFamily: 'monospace',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ListItem>
                        </Collapse>
                        <ListItem>
                            <ListItemText
                                primary="Add start"
                            />
                        </ListItem>
                        <ListItem>
                            <TimePicker onChange={handleChangeStart} />
                        </ListItem>
                        <ListItem>
                            <SwitchOpen label="Add continuous repeat [optional]" onChange={handleSwitchRepeat}>
                                <TimePeriodPicker onChange={handleChangeRepeat} />
                            </SwitchOpen>
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Add closure"
                            />
                        </ListItem>
                        <ListItem>
                            <Closure onChange={handleChangeClosure} />
                        </ListItem>
                        <ListItem>
                            <SwitchOpen label="Add arguments [optional]" onChange={handleSwitchArgs}>
                                <VariablesArray input={args} onChange={handleChangeArgs} />
                            </SwitchOpen>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

AddTimerDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default AddTimerDialog;
