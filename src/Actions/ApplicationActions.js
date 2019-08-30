import { emit } from './BaseActions';
import { setGlobal } from 'reactn';


const ApplicationActions = {

    connected: () => {
        emit('/connected').done((data) => {
            setTimeout(() => {
                setGlobal({
                    loaded: data.loaded,
                    connected: data.connected,
                });
            }, 1000);
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    connect: ({host, user, password}) => {
        emit('/connect', {host, user, password}).done((data) => {
            setGlobal({
                connErr: data.connErr,
                connected: data.connected,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    connectOther: ({host}) => {
        emit('/connect/other', {host}).done((data) => {
            setGlobal({
                connErr: data.connErr, // QUEST: vangt deze alle errors af?
                connected: data.connected,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    disconnect: () => {
        emit('/disconnect').done(() => {
            setGlobal({
                loaded: false,
                connected: false,
                connErr: '',
            });
        }); //.fail((_xhr, {error}) => onError(error));
    },

    navigate: (match) => {
        setGlobal({match});
    },
};

export default ApplicationActions;
