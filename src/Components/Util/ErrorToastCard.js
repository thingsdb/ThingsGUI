import { amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
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
import PropTypes from 'prop-types';

import { ErrorActions} from '../../Stores';
import {useThingsError} from '../Util';

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: amber[700],
        margin: theme.spacing(1),
    },
    panel: {
        backgroundColor: amber[700],
    },
    title: {
        marginLeft: theme.spacing(2)
    },
}));


const ErrorToastCard = ({index, thingsError}) => {
    const classes = useStyles();
    const [title, body] = useThingsError(thingsError);

    const handleCloseError = () => {
        ErrorActions.removeToastError(index);
    };

    return(
        <Slide direction="up" in timeout={{enter: 500}}>
            <Card className={classes.card}>
                <Accordion className={classes.panel}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <WarningIcon />
                        <Typography className={classes.title}>
                            {'Warning: '}
                            {title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="caption">
                            {body}
                        </Typography>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button onClick={handleCloseError}>
                            <CloseIcon />
                        </Button>
                    </AccordionActions>
                </Accordion>
            </Card>
        </Slide>
    );
};

ErrorToastCard.propTypes = {
    index: PropTypes.number.isRequired,
    thingsError: PropTypes.string.isRequired,
};

export default ErrorToastCard;

