import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {ThingsdbActions} from './ThingsdbStore';

const CollectionActions = Vlow.createActions([
    'query',
    'rawQuery',
    'queryEditor',
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
        this.emit('queryThing', {
            collectionName: collection.name,
            thingId: thingId,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const things = thingId ?
                    Object.assign({}, prevState.things, {[thingId]: data.Things})
                    :
                    Object.assign({}, prevState.things, {[collection.collection_id]: data.Things});
                return {things};
            });
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRawQuery(collection, thingId, query, tag, cb) {
        this.emit('queryRaw', {
            collectionName: collection.name,
            thingId: thingId,
            query: query,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data.Things});
                return {things};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onQueryEditor(scope, collectionId, query, onOutput, tag) {
        this.emit('queryEditor', {
            scope: scope,
            query: query,
        }).done((data) => {
            onOutput(data.Output);
            if (collectionId!==null) {
                this.setState(prevState => {
                    const things = Object.assign({}, prevState.things, {[collectionId]: data.Things});
                    return {things};
                });
            } else {
                ThingsdbActions.getInfo();
            }

        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }
}

export {CollectionActions, CollectionStore};
