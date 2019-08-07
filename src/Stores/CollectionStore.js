import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionActions = Vlow.createActions([
    'query',
    'queryThing',
    'property',
    'propertyThing'
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
        this.emit('/collection/returnproperty', {
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

    onPropertyThing(collection, thing, search, onError, depth=1) {
        this.emit('/collection/returnproperty', {
            collectionId: collection.collection_id,
            thingId: thing['#'],
            search: search,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const thingsByProp = Object.assign({}, prevState.thingsByProp, {[thing['#']]: data});
                return {thingsByProp};
            });
        }).fail((event, status, message) => onError(message));
    }
}

export {CollectionActions, CollectionStore};
