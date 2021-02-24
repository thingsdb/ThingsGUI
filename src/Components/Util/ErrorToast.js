import { amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Accordion from '@material-ui/core/Accordion';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Card from '@material-ui/core/Card';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import React from 'react';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';

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
                            <Accordion className={classes.panel}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <WarningIcon />
                                    <Typography>
                                        {'Warning'}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="caption">
                                        {e}
                                    </Typography>
                                </AccordionDetails>
                                <AccordionActions>
                                    <Button color="primary" onClick={handleCloseError(i)}>
                                        <CloseIcon />
                                    </Button>
                                </AccordionActions>
                            </Accordion>
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

