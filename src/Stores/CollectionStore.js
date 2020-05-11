/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';

const CollectionActions = Vlow.createActions([
    'blob',
    'queryWithReturn',
    'queryWithReturnDepth',
    'rawQuery',
    'download',
    'cleanupTmp',
    'resetCollectionStore'
]);


class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
    }

    static defaults = {
        things: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }


    onResetCollectionStore() {
        this.setState({
            things: {},
        });
    }

    onQueryWithReturnDepth(collection, thingId=null, depth=1) {
        const query = thingId ? `return(#${thingId}, ${depth})` : `return(thing(.id()), ${depth})`;
        const scope = `@collection:${collection.name}`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const things = thingId ?
                    Object.assign({}, prevState.things, {[thingId]: data})
                    :
                    Object.assign({}, prevState.things, {[collection.collection_id]: data});
                return {things};
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onQueryWithReturn(scope, q, thingId, tag, cb) {
        const query = `${q} #${thingId}`;
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data});
                return {things};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onRawQuery(scope, query, tag, cb) {
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onBlob(scope, q, thingId, blob, tag, cb) {
        const query = `${q} #${thingId}`;
        this.emit('queryBlob', {
            query,
            scope,
            blob,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data});
                return {things};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onDownload(link, cb) {
        this.post('/download', link).done((textFile) => {
            cb(textFile);
        }).fail((error, message) => {
            ErrorActions.setToastError(`${error.statusText}: ${message}`);
        });
    }

    onCleanupTmp() {
        this.emit('cleanupTmp').done((_data) => null).fail((event, status, message) => {
            ErrorActions.setToastError(message.Log);
        });
    }
}

export {CollectionActions, CollectionStore};
