/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';


class StartStopPolling extends React.Component {

    static propTypes = {
        onPoll: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
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
        const {intervalId, timeoutId} = this.state;
        console.log(intervalId);
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
        console.log(intervalId);
        this.setState({
            polling:false
        });
    };


    render() {
        const {title} = this.props;
        const {polling} = this.state;
        return (
            <Tooltip disableFocusListener disableTouchListener title={polling?`Stop polling ${title}`:`Start polling ${title}`}>
                <Button variant="outlined" color="primary" onClick={polling?this.handleStopPoll:this.handleStartPoll}>
                    <ScheduleIcon color={polling?'primary':'disabled'} />
                </Button>
            </Tooltip>
        );
    }
}

export default StartStopPolling;
