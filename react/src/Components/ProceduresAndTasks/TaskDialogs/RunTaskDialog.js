import { amber } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import { TaskActions } from '../../../Stores';
import { ErrorMsg, SimpleModal, QueryOutput } from '../../Utils';
import { RunTaskDialogTAG } from '../../../Constants/Tags';

const tag = RunTaskDialogTAG;

const RunTaskDialog = ({button, open, onClose, task, scope}) => {
    const [output, setOutput] = React.useState('');
    const [tabIndex, setTabIndex] = React.useState(0);

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
        TaskActions.runTask(
            scope,
            task,
            tag,
            handleResult,
        );
    };

    const handleChangeTab = (newValue) => {
        setTabIndex(newValue);
    };

    return (
        <SimpleModal
            button={button}
            open={open}
            onClose={onClose}
            actionButtons={
                <React.Fragment>
                    {task.with_side_effects&&(
                        <ListItem>
                            <Typography variant="caption" sx={{color: amber[700]}}>
                                {'Note: this task generates an event.'}
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
                        <Typography variant="body1" >
                            {'Run  ThingDB task:'}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {task.id || ''}
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
                                <ListItemText primary="Output:" />
                            </ListItem>
                            <div id="output">
                                <QueryOutput output={output} tabIndex={tabIndex} onChangeTab={handleChangeTab} />
                            </div>
                        </React.Fragment>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

RunTaskDialog.defaultProps = {
    button: null,
    task: {},
};


RunTaskDialog.propTypes = {
    button: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
    scope: PropTypes.string.isRequired,
};

export default RunTaskDialog;
