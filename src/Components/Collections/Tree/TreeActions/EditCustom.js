/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';

import CustomChild from './CustomChild';
import {Stepper} from '../../../Util';


const EditCustom = ({cb, customTypes, name, type}) => {
    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        setActiveStep(0);
    }, [type]);

    const getMaxSteps = (customTypes, type, step) => {
        let s=0;
        if (customTypes[type]) {
            let si=0;
            Object.entries(customTypes[type]).map(([k, t]) => {
                if (t.includes('[') || t.includes('{')) {
                    t = t.substring(1, t.length-1);
                }
                si = getMaxSteps(customTypes, t, step+1);
                s = si>s?si:s;
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
            <Stepper activeStep={activeStep} maxSteps={maxSteps} onNext={handleNext} onBack={handleBack}>
                <CustomChild cb={cb} customTypes={customTypes} name={name} type={type} activeStep={activeStep} stepId={0} />
            </Stepper>
        </React.Fragment>
    );
};

EditCustom.defaultProps = {
    customTypes: null,
};
EditCustom.propTypes = {
    cb: PropTypes.func.isRequired,
    customTypes: PropTypes.object,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default EditCustom;