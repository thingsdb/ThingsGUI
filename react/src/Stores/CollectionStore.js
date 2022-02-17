/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';

import { BaseStore } from './BaseStore';
import { COLLECTION_SCOPE } from '../Constants/Scopes';
import { ErrorActions } from './ErrorStore';
import { jsonify } from './Utils';
import { THING_KEY } from '../Constants/CharacterKeys';
import { ID_ARGS } from '../TiQueries/Arguments';
import {
    SQUARE_BRACKETS_QUERY,
    THING_FORMAT_QUERY,
    THING_CURRENT_QUERY,
    THING_QUERY,
} from '../TiQueries/Queries';


const CollectionActions = Vlow.createActions([
    'cleanupThings',
    'cleanupTmp',
    'decCounter',
    'disableSubmit',
    'download',
    'enableSubmit',
    'getThings',
    'incCounter',
    'query',
    'refreshThings',
    'removeThing',
    'resetCollectionStore',
]);


class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
        thingCounters: PropTypes.object,
        canSubmit: PropTypes.bool,
    }

    static defaults = {
        things: {},
        thingCounters: {},
        canSubmit: true,
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }

    onResetCollectionStore() {
        this.setState({
            things: {},
            thingCounters: {},
        });
    }

    onIncCounter(thingId) {
        this.setState(prevState => {
            let counter = (prevState.thingCounters[thingId] || 0) + 1;
            return {thingCounters: {...prevState.thingCounters, [thingId]: counter}};
        });
    }

    onDecCounter(thingId) {
        this.setState(prevState => {
            let update = {...prevState.thingCounters};
            let counter = update[thingId];
            if(counter && counter > 1) {
                counter = counter - 1;
                return {thingCounters: {...prevState.thingCounters, [thingId]: counter}};
            } else {
                delete update[thingId];
                return {thingCounters: update};
            }
        });
    }

    onGetThings(collectionId, collectionName, thingId=null) {
        const scope = `${COLLECTION_SCOPE}:${collectionName}`;
        let query = THING_CURRENT_QUERY;
        let jsonArgs = '';

        if (thingId) {
            query = THING_QUERY;
            jsonArgs = ID_ARGS(thingId);
        }
        this.emit('query', {
            query,
            scope,
            arguments: jsonArgs
        }).done((data) => {
            this.setState(prevState => {
                const things = thingId ?
                    Object.assign({}, prevState.things, {[thingId]: data})
                    :
                    Object.assign({}, prevState.things, {[collectionId]: data});
                return {things};
            });
            this.onIncCounter(thingId || collectionId);
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRefreshThings(collectionName) {
        const {things} = this.state;
        const ids = Object.keys(things);

        if(ids.length) {
            const query = SQUARE_BRACKETS_QUERY(ids.map(id => THING_FORMAT_QUERY(id)));
            const scope = `${COLLECTION_SCOPE}:${collectionName}`;
            this.emit('query', {
                query,
                scope
            }).done((data) => {
                this.setState({things: data.reduce((res, d) => {res[d[THING_KEY]] = d ;return res;}, {})});
            }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
        }
    }

    onRemoveThing(thingId) {
        const {thingCounters} = this.state;
        if(thingCounters[thingId] < 2) {
            this.setState(prevState => {
                let update = {...prevState.things};
                delete update[thingId];
                return {things: update};
            });
        }
        this.onDecCounter(thingId);
    }

    onCleanupThings(collectionId=null) {
        const {things} = this.state;
        this.setState({
            things: collectionId && things[collectionId] ? {[collectionId]: things[collectionId]} : {}, // To ensure that the collection data is shown on opening. Clicking the container (open->close->open) to fast will not trigger the onGetThings() and no data is shown otherwise.
            thingCounters: {} // Will be inc at onGetThings()
        });
    }

    onQuery(scope, query, tag, cb, thingId=null, blob=null, args=null, onFail=()=>null) {
        let jsonArgs = null;
        if (args) {
            jsonArgs = jsonify(args); // make it json proof
        }

        this.emit('query', {
            query,
            scope,
            blob,
            arguments: jsonArgs
        }).done((data) => {
            if(thingId){
                this.setState(prevState => {
                    const things = Object.assign({}, prevState.things, {[thingId]: data});
                    return {things};
                });
            }
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
            onFail();
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

    onDisableSubmit() {
        this.setState({canSubmit: false});
    }

    onEnableSubmit() {
        this.setState({canSubmit: true});
    }
}

export {CollectionActions, CollectionStore};
