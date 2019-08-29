import BaseActions from './BaseActions';

export default class ApplicationActions extends BaseActions {
    connected() {
        this.emit('/connected').done((data) => {
            setTimeout(() => {
                this.setGlobal({
                    loaded: data.loaded,
                    connected: data.connected,
                });
            }, 1000);
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    connect({host, user, password}) {
        this.emit('/connect', {host, user, password}).done((data) => {
            this.setGlobal({
                connErr: data.connErr,
                connected: data.connected,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    connectOther({host}) {
        this.emit('/connect/other', {host}).done((data) => {
            this.setGlobal({
                connErr: data.connErr, // QUEST: vangt deze alle errors af?
                connected: data.connected,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    disconnect() {
        this.emit('/disconnect').done(() => {
            this.setGlobal({
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
