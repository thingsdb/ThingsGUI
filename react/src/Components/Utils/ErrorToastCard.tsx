import { amber } from '@mui/material/colors';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';

import { ErrorActions } from '../../Stores';
import { useThingsError } from '.';


const ErrorToastCard = ({index, thingsError}: Props) => {
    const [title, body] = useThingsError(thingsError);

    const handleCloseError = () => {
        ErrorActions.removeToastError(index);
    };

    return(
        <Slide direction="up" in timeout={{enter: 500}}>
            <Card sx={{backgroundColor: amber[700], margin: '8px'}}>
                <Accordion sx={{backgroundColor: amber[700]}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <WarningIcon />
                        <Typography sx={{marginLeft: '16px'}}>
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
                        <IconButton onClick={handleCloseError}>
                            <CloseIcon />
                        </IconButton>
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

interface Props {
    index: number;
    thingsError: string;
}