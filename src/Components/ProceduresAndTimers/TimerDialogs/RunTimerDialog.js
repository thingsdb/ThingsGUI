import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {TimerActions} from '../../../Stores';
import {ErrorMsg, SimpleModal, QueryOutput} from '../../Util';
import {RunTimerDialogTAG} from '../../../constants';

const useStyles = makeStyles(() => ({
    warnColor: {
        color: amber[700],
    },
}));

const tag = RunTimerDialogTAG;

const RunTimerDialog = ({button, open, onClose, timer, scope}) => {
    const classes = useStyles();
    const [output, setOutput] = React.useState('');

    React.useEffect(() => { // clean state
        setOutput('');
    },
    [open],
    );

    const handleResult = (data) => {
        setOutput(data);
        const elmnt = document.getElementById('output');
        elmnt.scrollIntoView();
    };

    const handleClickOk = () => {
        TimerActions.runTimer(
            scope,
            timer.id,
            tag,
            handleResult,
        );
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            actionButtons={
                <React.Fragment>
                    {timer.with_side_effects&&(
                        <ListItem>
                            <Typography variant="caption" className={classes.warnColor}>
                                {'Note: this timer generates an event.'}
                            </Typography>
                        </ListItem>
                    )}
                    <Button color="primary" onClick={handleClickOk}>
                        {'Run'}
                    </Button>
                </React.Fragment>
            }
            maxWidth="md"
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="h4" color='primary' component='span'>
                            {`Run timer${timer?`: ${timer.id}`:''}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <React.Fragment>
                            <ListItem>
                                <ListItemText primary="Output:" primaryTypographyProps={{variant: 'body1'}} />
                            </ListItem>
                            <div id="output">
                                <QueryOutput output={output} />
                            </div>
                        </React.Fragment>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

RunTimerDialog.defaultProps = {
    button: null,
    timer: {},
};


RunTimerDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    timer: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default RunTimerDialog;
