import { amber } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import React from 'react';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';

import { ErrorActions} from '../../Stores';
import {useThingsError} from '.';

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

