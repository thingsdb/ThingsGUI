import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionActions = Vlow.createActions([
    'query',
    'property',
    'removeThing',
    'rawQuery',
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

    onQuery(collectionId, onError, thingId=null, depth=1) {
        this.emit('/collection/query', {
            collectionId: collectionId,
            thingId: thingId,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const things = thingId ? 
                Object.assign({}, prevState.things, {[thingId]: data})
                :
                Object.assign({}, prevState.things, {[collectionId]: data});
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

    onProperty(collectionId, thingId, propertyName, onError, depth=1) {
        this.emit('/collection/return-property', {
            collectionId: collectionId,
            thingId: thingId,
            propertyName: propertyName,
            depth: depth
        }).done((data) => {
            this.setState(prevState => {
                const thingsByProp = Object.assign({}, prevState.thingsByProp, {[collectionId]: data});
                return {thingsByProp};
            });
        }).fail((event, status, message) => onError(message));
    }

    onRemoveThing(config, onError) {
        this.emit('/collection/remove-thing', config).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[config.thingId]: data})
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }

    onRawQuery(collectionId, thingId, query, onError) {
        this.emit('/collection/raw-query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data})
                return {things};
            });
        }).fail((event, status, message) => onError(message));
    }
}

export {CollectionActions, CollectionStore};
