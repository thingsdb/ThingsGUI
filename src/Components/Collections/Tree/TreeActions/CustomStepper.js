/* eslint-disable react/no-multi-comp */
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles(() => ({
    fullWidth: {
        width: '100%',
    },
    margin: {
        padding: 0,
        margin: 0,
    }
}));


const CustomStepper = ({onAdd, onBack, onNext, activeStep, maxSteps, renderCustom, items}) => {
    const classes = useStyles();

    return(
        <React.Fragment>
            {maxSteps>1 ? (
                <React.Fragment>
                    <Divider color="primary" />
                    <Grid container item xs={12} alignItems="center" >
                        <Grid item xs={2} container justify="flex-start">
                            <Button size="small" onClick={onBack} disabled={activeStep === 0}>
                                <KeyboardArrowLeft color="primary" />
                                {'Back'}
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            <Stepper className={classes.margin} activeStep={activeStep}>
                                {items.map((c, i) => (
                                    <Step key={c[0]}>
                                        <StepLabel>
                                            {c[0]}
                                            <Collapse key={c[0]} className={classes.fullWidth} in={i==activeStep} timeout="auto">
                                                {renderCustom(c)}
                                            </Collapse>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Grid>
                        <Grid item xs={2} container justify="flex-end">
                            {activeStep === maxSteps - 1 ? (
                                <Button size="small" onClick={onAdd}>
                                    {'Finish'}
                                    <AddIcon color="primary" />
                                </Button>

                            ):(
                                <Button size="small" onClick={onNext} disabled={activeStep === maxSteps - 1}>
                                    {'Next'}
                                    <KeyboardArrowRight color="primary" />
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                    <Divider color="primary" />
                </React.Fragment>
            ) : null}
        </React.Fragment>
    );
};

CustomStepper.propTypes = {
    activeStep: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    maxSteps: PropTypes.number.isRequired,
    onAdd: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    renderCustom: PropTypes.func.isRequired,
};
export default CustomStepper;