/* eslint-disable react/no-multi-comp */
import Button from '@material-ui/core/Button';
import SchuduleIcon from '@material-ui/icons/Schedule';
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
            polling: false,
        };
    }


    componentWillUnmount() {
        const {intervalId} = this.state;
        console.log(intervalId);
        this.handleStopPoll();
    }

    handleStartPoll = () => {
        const {onPoll} = this.props;
        const setPoll = setInterval(
            () => {
                onPoll();
            }, 1000);
        this.setState({
            intervalId:setPoll,
            polling:true
        });
        setTimeout(
            () => {
                this.handleStopPoll();
            }, 300000); // after 5 min it stops
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
                    <SchuduleIcon color={polling?'primary':'disabled'} />
                </Button>
            </Tooltip>
        );
    }
}

export default StartStopPolling;
