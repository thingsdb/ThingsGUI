import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';

const CollectionActions = Vlow.createActions([
    'query',
    'removeThing',
    'rawQuery',
    'queryWithOutput',
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

    onQuery(collectionId, thingId=null, depth=1) {
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
        }).fail((event, status, message) => ErrorActions.setToastError(message.log));
    }

    onRemoveThing(config, tag) {
        this.emit('/collection/remove_thing', config).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[config.thingId]: data});
                return {things};
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onRawQuery(collectionId, thingId, query, tag) {
        this.emit('/collection/raw_query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data});
                return {things};
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }

    onQueryWithOutput(collectionId, query, onOutput, tag) {
        this.emit('/collection/query_with_output', {
            collectionId: collectionId,
            query: query,
        }).done((data) => {
            onOutput(data.output);
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[collectionId]: data.things});
                return {things};
            });
            return true;
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
            return false;
        });
    }
}

export {CollectionActions, CollectionStore};
