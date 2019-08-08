import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionActions = Vlow.createActions([
    'query',
    'queryThing',
    'property',
    'renameKey',
    'removeObject',
]);

// TODO: CALLBACKS
class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
        thingsByProp: PropTypes.object,
    }

    static defaults = {
        things: {},
        thingsByProp: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }

    onQuery(collection, onError, depth=1) {
        this.emit('/collection/query', {
            collectionId: collection.collection_id,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[collection.collection_id]: data});
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

    onQueryThing(collection, thing, onError, depth=1) {
        this.emit('/collection/query', {
            collectionId: collection.collection_id,
            thingId: thing['#'],
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thing['#']]: data});
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

    onProperty(collection, thingId, search, onError, depth=1) {
        this.emit('/collection/return-property', {
            collectionId: collection.collection_id,
            thingId: thingId,
            search: search,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const thingsByProp = Object.assign({}, prevState.thingsByProp, {[collection.collection_id]: data});
                return {thingsByProp};
            });
        }).fail((event, status, message) => onError(message));
    }

    onRenameKey(collection, thingId, oldname, newname, onError) {
        this.emit('/collection/rename-key', {
            collectionId: collection.collection_id,
            thingId: thingId,
            oldname: oldname,
            newname: newname
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data});
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

    onRemoveObject(collection, thingId, propertyName, onError) {
        console.log(thingId, propertyName);
        this.emit('/collection/remove-object', {
            collectionId: collection.collection_id,
            thingId: thingId,
            propertyName: propertyName,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.thingsByProp, {[collection.collection_id]: data});
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

}

export {CollectionActions, CollectionStore};
