import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {ThingsdbActions} from './ThingsdbStore';

const CollectionActions = Vlow.createActions([
    'query',
    'removeThing',
    'rawQuery',
    'queryWithOutput',
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

    onRawQuery(collectionId, thingId, query, tag, cb) {
        this.emit('/collection/raw_query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            this.setState(prevState => {
                const things = Object.assign({}, prevState.things, {[thingId]: data});
                return {things};
            });
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
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
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
        });
    }

    onQueryEditor(scope, isCollection, query, onOutput, tag) {
        this.emit('/collection/query_editor', {
            scope: scope,
            query: query,
        }).done((data) => {
            onOutput(data.output);
            if (isCollection) {
                this.setState(prevState => {
                    const things = Object.assign({}, prevState.things, {[data.collectionId]: data.things});
                    return {things};
                });
            } else {
                ThingsdbActions.getInfo();
            }

        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.log);
        });
    }
}

export {CollectionActions, CollectionStore};
