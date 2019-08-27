import {BaseStore} from './NewBaseStore';

// aplicationstore.js
class ApplicationStore extends BaseStore {
    static defaults = {
        loaded: false,
        connected: false,
        connErr: '',
        match: {},
    }

    constructor(props) {
        super(props);
        this.state = ApplicationStore.defaults;
    }

    connected(onError) {
        this.emit('/connected').done((data) => {
            setTimeout(() => {
                this.setState({
                    loaded: data.loaded,
                    connected: data.connected,
                });
            }, 1000);
        }).fail((event, status, message) => onError(message));
    }

    connect({host, user, password}, onError) {
        this.emit('/connect', {host, user, password}).done((data) => {
            this.setState({
                connErr: data.connErr,
                connected: data.connected,
            });
        }).fail((event, status, message) => onError(message));
    }

    connectOther({host}, onError) {
        this.emit('/connect/other', {host}).done((data) => {
            this.setState({
                connErr: data.connErr, // QUEST: vangt deze alle errors af?
                connected: data.connected,
            });
        }).fail((event, status, message) => onError(message));
    }

    disconnect() {
        this.emit('/disconnect').done(() => {
            this.setState({
                connected: false,
                connErr: '',
                match: {},
            });
        }); //.fail((_xhr, {error}) => onError(error));
    }

    navigate(match) {
        this.setState({match});
    }
}

export default ApplicationStore;