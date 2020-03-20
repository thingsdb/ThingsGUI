/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    green: {
        color: theme.palette.primary.green,
    },
    disabled: {
        color: 'rgba(255, 255, 255, 0.3)',
    },
});

class StartStopPolling extends React.Component {

    static propTypes = {
        onPoll: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,

        /* Styles properties */
        classes: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            intervalId: null,
            timeoutId: null,
            polling: false,
        };
    }


    componentWillUnmount() {
        const {timeoutId} = this.state;
        this.handleStopPoll();
        clearTimeout(timeoutId);
    }

    handleStartPoll = () => {
        const {onPoll} = this.props;
        const iid = setInterval(
            () => {
                onPoll();
            }, 1000);
        const tid= setTimeout(
            () => {
                this.handleStopPoll();
            }, 300000); // after 5 min it stops
        this.setState({
            intervalId:iid,
            polling:true,
            timeoutId: tid,
        });
    };

    handleStopPoll = () => {
        const {intervalId} = this.state;
        clearInterval(intervalId);
        this.setState({
            polling:false
        });
    };


    render() {
        const {classes, title} = this.props;
        const {polling} = this.state;
        return (
            <Tooltip disableFocusListener disableTouchListener title={polling?`Stop polling ${title}`:`Start polling ${title}`}>
                <Button variant="text" onClick={polling?this.handleStopPoll:this.handleStartPoll}>
                    <ScheduleIcon className={polling?classes.green:classes.disabled} />
                </Button>
            </Tooltip>
        );
    }
}

export default withStyles(styles)(StartStopPolling);
