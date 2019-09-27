import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {ThingsdbActions} from './ThingsdbStore';

const CollectionActions = Vlow.createActions([
    'blob',
    'query',
    'rawQuery',
    'queryEditor',
    'download',
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

    onQuery(collection, thingId=null, depth=1) {
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

    onRawQuery(collection, thingId, q, tag, cb) {
        const query = `${q} #${thingId}`;
        const scope = `@collection:${collection.name}`;
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

    onQueryEditor(query, scope, collectionId, onOutput, tag) {
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
                ThingsdbActions.getInfo();
            }
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onBlob(collection, thingId, q, blob, tag, cb) {
        const query = `${q} #${thingId}`;
        const scope = `@collection:${collection.name}`;
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
        }).fail((error) => {
            ErrorActions.setToastError(error.response);
        });
    }
}

export {CollectionActions, CollectionStore};
