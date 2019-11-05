/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import MobileStepper from '@material-ui/core/MobileStepper';
import PropTypes from 'prop-types';
import React from 'react';


const Stepper = ({children, activeStep, maxSteps, onNext, onBack}) => {

    const handleNext = () => {
        onNext();
    };

    const handleBack = () => {
        onBack();
    };

    // const hasNext = Boolean(next);
    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                {children}
            </Grid>
            <Grid item xs={12}>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    variant="text"
                    activeStep={activeStep}
                    nextButton={
                        <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                            {'Next'}
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />
                            {'Back'}
                        </Button>
                    }
                />
            </Grid>
        </Grid>
    );
};

Stepper.propTypes = {
    children: PropTypes.object.isRequired,
    activeStep: PropTypes.number.isRequired,
    maxSteps: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default Stepper;