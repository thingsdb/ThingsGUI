import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionActions = Vlow.createActions([
    'query',
    'queryThing',
]);

class CollectionStore extends BaseStore {

    static types = {
        collectionId: PropTypes.string, 
        collectionName: PropTypes.string,
        things: PropTypes.object,
    }

    static defaults = {
        collectionId: '', 
        collectionName: '',
        things: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }

    onQuery(collection) {
        this.emit('/collection/query', {
            collectionId: collection.collection_id,
        }).done((data) => {
            this.setState(prevState => {
                window.console.log(data, collection);
                const things = Object.assign({}, prevState.things, {[collection.collection_id]: data});
                return {
                    collectionId: collection.collection_id,
                    collectionName: collection.name,
                    things,
                };
            });
        });
    }

    onQueryThing(collection, thing) {
        this.emit('/collection/query', {
            collectionId: collection.collection_id,
            thingId: thing['#'],
        }).done((data) => {
            this.setState(prevState => {
                window.console.log(data);
                const things = Object.assign({}, prevState.things, {[thing['#']]: data});
                return {things};
            });
        });
    }

}

export {CollectionActions, CollectionStore};
