import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, TimerActions} from '../../../Stores';
import {ErrorMsg, SimpleModal, VariablesArray} from '../../Util';
import {EditTimerDialogTAG} from '../../../constants';

const useStyles = makeStyles(() => ({
    warnColor: {
        color: amber[700],
    },
}));

const replaceNull = (items) => items.map(item => item === null ? 'nil' : item);

const tag = EditTimerDialogTAG;

const EditTimerDialog = ({button, open, onClose, timer, scope}) => {
    const classes = useStyles();
    const [queryString, setQueryString] = React.useState('set_timer_args()');
    const [args, setArgs] = React.useState([]);

    React.useEffect(() => {
        if(open) {
            TimerActions.getTimerArgs(
                scope,
                timer.id,
                tag,
                (a) => {
                    setArgs(a);
                    setQueryString(`set_timer_args(${timer.id}, [${replaceNull(a)}])`);
                });
        }
    }, [open, scope, timer.id]);

    const handleChangeArgs = (a) => {
        setArgs(a);
        setQueryString(`set_timer_args(${timer.id}, [${replaceNull(a)}])`);
    };

    const handleClickOk = () => {
        CollectionActions.rawQuery(
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
            button={button}
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
            actionButtons={timer.with_side_effects?(
                <ListItem>
                    <Typography variant="caption" className={classes.warnColor}>
                        {'Note: this timer generates an event.'}
                    </Typography>
                </ListItem>
            ):null}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {'Customizing ThingDB timer:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {timer.id || ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <Collapse in={Boolean(queryString)} timeout="auto">
                            <ListItem>
                                <TextField
                                    name="queryString"
                                    label="Query"
                                    type="text"
                                    value={queryString}
                                    fullWidth
                                    multiline
                                    rowsMax="10"
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
                            <Typography variant="body1" >
                                {'Edit timer:'}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <TextField
                                name="timer"
                                type="text"
                                variant="standard"
                                value={timer.definition}
                                fullWidth
                                multiline
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
                        <ListItem>
                            <ListItemText
                                primary="Set arguments"
                            />
                        </ListItem>
                        <ListItem>
                            <VariablesArray input={replaceNull(args)} onChange={handleChangeArgs} />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

EditTimerDialog.defaultProps = {
    button: null,
    timer: {},
};

EditTimerDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    timer: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default EditTimerDialog;
