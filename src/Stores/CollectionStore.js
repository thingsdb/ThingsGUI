import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {ThingsdbActions} from './ThingsdbStore';

const CollectionActions = Vlow.createActions([
    'blob',
    'queryWithReturn',
    'queryWithReturnDepth',
    'rawQuery',
    'queryEditor',
    'download',
    'cleanupTmp',
]);

// TODO: CALLBACKS
class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
        thingsByProp: PropTypes.object,
    }

    static defaults = {
        things: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
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

    onRawQuery(scope, q, tag, cb) {
        const query = `${q}`;
        this.emit('query', {
            query,
            scope
        }).done(() => {
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onQueryEditor(scope, query, collectionId, onOutput, tag) {
        this.emit('queryEditor', {
            query,
            scope
        }).done((data) => {
            onOutput(data.output);
            if (collectionId!==null) {
                this.setState(prevState => {
                    const things = Object.assign({}, prevState.things, {[collectionId]: data.things});
                    return {things};
                });
            } else {
                ThingsdbActions.getCollections(); //TODO weghalen
                ThingsdbActions.getUsers();
                ThingsdbActions.getUser();
            }
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
