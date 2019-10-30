/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


const Stepper = ({children, maxSteps, onNext, onBack}) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        onNext();
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        onBack();
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    // const hasNext = Boolean(next);
    return(
        <React.Fragment>
            {children}
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
        </React.Fragment>
    );
};

Stepper.propTypes = {
    children: PropTypes.object.isRequired,
    maxSteps: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default Stepper;