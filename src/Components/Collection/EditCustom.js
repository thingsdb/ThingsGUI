/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';

import CustomChild from './CustomChild';
import {Stepper} from '../Util';


const EditCustom = ({errors, cb, customTypes, name, type}) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const getMaxSteps = (customTypes, type, step) => {
        let s;
        if (customTypes[type]) {
            Object.entries(customTypes[type]).map(([k, t]) => {
                s = getMaxSteps(customTypes, t, step+1);
            });
        } else {
            s = step;
        }
        return s;
    };

    const maxSteps = getMaxSteps(customTypes, type, 1);

    const handleNext = () => {
        setActiveStep(activeStep+1);
    };

    const handleBack = () => {
        setActiveStep(activeStep-1);
    };

    return(
        <React.Fragment>
            <Stepper maxSteps={maxSteps} onNext={handleNext} onBack={handleBack}>
                <CustomChild errors={errors} cb={cb} customTypes={customTypes} name={name} type={type} activeStep={activeStep} stepId={0} />
            </Stepper>
        </React.Fragment>
    );
};

EditCustom.defaultProps = {
    customTypes: null,
};
EditCustom.propTypes = {
    cb: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default EditCustom;