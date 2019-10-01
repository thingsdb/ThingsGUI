/* global process */

import Vlow from 'vlow';
import io from 'socket.io-client';

const socket = io.connect(`${window.location.protocol}//${window.location.host}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket']
});

class _SocketRequest {

    _doneCb() {
    }

    _failCb(event, status, message) {
        window.console.error(event, status, message);
    }

    _alwaysCb() {
    }

    constructor(event, ...data) {
        window.console.debug(`Socket request: "${event}"`, data);

        var warnOnLong = setTimeout(() => {
            window.console.warn(`No result for request "${event}" within 3 seconds.`);
        }, 3000);
        socket.emit(event, ...data, (status, data, message) => {
            clearTimeout(warnOnLong);
            if (message !== undefined && message !== null) {
                // MessageActions.add(message);
            }

            this._alwaysCb(status, data);
            if (status === 200) {
                window.console.debug(`Socket response ("${event}"):`, data);
                this._doneCb(data);
            } else if (status === 125) {
                // ConnectionActions.triggerSessionError();
            } else {
                this._failCb(event, status, message);
            }
        });
    }

    done(doneCb) {
        this._doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this._failCb = failCb;
        return this;
    }

    always(alwaysCb) {
        this._alwaysCb = alwaysCb;
        return this;
    }
}

class _BlobRequest {

    constructor(type, url, data) {

        this.doneCb = function (data) { };          // eslint-disable-line
        this.failCb = function (xhr, data) { };   // eslint-disable-line

        var textFile = null;
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'blob';

        xhr.onreadystatechange = () => {
            if (xhr.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status == 200) {
                const blob = new Blob([xhr.response], {type: 'application/octet-stream'});
                // If we are replacing a previously generated file we need to
                // manually revoke the object URL to avoid memory leaks.
                if (textFile !== null) {
                    window.URL.revokeObjectURL(textFile);
                }
                textFile = window.URL.createObjectURL(blob);
                this.doneCb(textFile);
            } else {
                let rsp;
                try {
                    const blob = new Blob([xhr.response], {type: 'text/plain'});
                    const reader = new FileReader();

                    // This fires after the blob has been read/loaded.
                    reader.addEventListener('loadend', (e) => {
                        rsp = e.srcElement.result;
                        this.failCb(xhr, rsp);
                    });

                    // Start reading the blob as text.
                    reader.readAsText(blob);
                } catch (e) {
                    this.failCb(xhr, null);
                }

            }
        };

        xhr.send((!data) ? null : JSON.stringify(data));
    }

    done(doneCb) {
        this.doneCb = doneCb;
        return this;
    }

    fail(failCb) {
        this.failCb = failCb;
        return this;
    }
}

class BaseStore extends Vlow.Store {

    emit(name, data) {
        return new _SocketRequest(name, data);
    }

    post(url, data) {
        return new _BlobRequest('POST', url, data);
    }
}

// class PushNotificationStore extends BaseStore {

//     // static types = {
//     //     connected: PropTypes.bool,
//     //     loaded: PropTypes.bool,
//     //     msg: PropTypes.string,
//     // }

//     constructor() {
//         super(null);

//         this.state = {
//             connected: socket.connected,
//             loaded: false,
//             msg: 'Loading Oversight',
//         };

//         socket.on('reconnect', () => this.setState(() => ({
//             connected: socket.connected,
//             /* When re-connecting on intital load, loading the
//              * required resources never completes so we should force loaded to
//             * `true`.
//              */
//             loaded: true,

//         })));

//         socket.on('connect_failed', () => {
//             window.console.warn('Connection failed');
//         });

//         socket.on('connect', () => {
//             this.onLoadInterval = window.setInterval(this.onLoadedCheck, 1000);
//             this.setState({connected: true});
//         });

//         socket.on('reconnecting', (attempt) => {
//             let msg = `Connection lost, trying to reconnect... (attempt ${attempt})`;
//             window.console.warn(msg);
//             this.setState(() => ({
//                 connected: socket.connected,
//                 msg: msg
//             }));
//         });
//     }

// onLoadedCheck = () => {
//     if (activeRequests === 0) {
//         this.setState({loaded: true});
//         clearInterval(this.onLoadInterval);
//     }
// }

// onTriggerSessionError() {
//     this.setState({
//         loaded: false,
//         msg: 'Session has expired, redirecting to login...'
//     });

//     setTimeout(() => {
//         location.reload();
//     }, 3000);
// }
// }

export {BaseStore};