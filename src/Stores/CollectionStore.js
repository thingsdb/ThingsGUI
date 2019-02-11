import PropTypes from 'prop-types';
import Vlow from 'vlow';
import {BaseStore} from './BaseStore.js';

const CollectionActions = Vlow.createActions([
    'query',
    'queryThing',
]);

class CollectionStore extends BaseStore {

    static types = {
        collectionId: PropTypes.object,
        collectionName: PropTypes.string,
        collection: PropTypes.object,
        things: PropTypes.object,
    }

    static defaults = {
        collectionId: null,
        collectionName: '',
        collection: {},
        things: {},

    };

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }

    onQuery(collection) {
        this.emit('/collection/query', {
            collectionId: collection.collection_id,
        })
            .done((data) => {
                window.console.log(data, collection);
                this.setState({
                    collectionId: collection.collection_id,
                    collectionName: collection.name,
                    collection: data,
                });
            });
    }

    onQueryThing(thingId) {
        this.emit('/collection/query', {
            collectionId: this.state.collectionId,
            thingId,
        })
            .done((data) => {
                window.console.log(data);
                const {things} = this.state;
                things[thingId] = data;
                this.setState({
                    things,
                });
            });
    }
}

export {CollectionStore, CollectionActions};