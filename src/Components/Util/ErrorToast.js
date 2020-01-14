import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CloseIcon from '@material-ui/icons/Close';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';

import { ErrorActions, ErrorStore } from '../../Stores';


const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: amber[700],
        margin: theme.spacing(1),
    },
    panel: {
        backgroundColor: amber[700],
    },
    portal: {
        position: 'absolute',
        bottom: '1%',
        right: '1%',
        width: '400px',
        zIndex: '3',
    },
}));

const withStores = withVlow([{
    store: ErrorStore,
    keys: ['toastErrors']
}]);


const ErrorToast = ({toastErrors}) => {
    const classes = useStyles();

    const handleCloseError = (i) => () => {
        ErrorActions.removeToastError(i);
    };

    return(
        <div className={classes.portal}>
            <ul>
                {[...toastErrors].map((e, i) => (
                    <Slide key={i} direction="up" in timeout={{enter: 500}}>
                        <Card className={classes.card}>
                            <ExpansionPanel className={classes.panel}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <WarningIcon />
                                    <Typography>
                                        {'Warning'}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography variant="caption">
                                        {e}
                                    </Typography>
                                </ExpansionPanelDetails>
                                <ExpansionPanelActions>
                                    <IconButton onClick={handleCloseError(i)}>
                                        <CloseIcon />
                                    </IconButton>
                                </ExpansionPanelActions>
                            </ExpansionPanel>
                        </Card>
                    </Slide>
                ))}
            </ul>
        </div>
    );
};

ErrorToast.propTypes = {
    toastErrors: ErrorStore.types.toastErrors.isRequired,
};

export default withStores(ErrorToast);

