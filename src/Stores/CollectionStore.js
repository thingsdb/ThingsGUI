/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';

import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
import {COLLECTION_SCOPE} from '../Constants/Scopes';
// importing any method from Util creates a webpack error.
// import {depthOf} from '../Components/Util';


const CollectionActions = Vlow.createActions([
    'blob',
    'cleanupThings',
    'cleanupTmp',
    'decCounter',
    'download',
    'getThings',
    'incCounter',
    'queryWithReturn',
    'rawQuery',
    'refreshThings',
    'removeThing',
    'resetCollectionStore',
]);


class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
        thingCounters: PropTypes.object,
    }

    static defaults = {
        things: {},
        thingCounters: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }


    onResetCollectionStore() {
        this.setState(CollectionStore.defaults);
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
        const query = thingId ? `#${thingId}` : 'thing(.id())';
        const scope = `${COLLECTION_SCOPE}:${collectionName}`;
        this.emit('query', {
            query,
            scope
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
        const keys = Object.keys(things);

        if(keys.length) {
            const query = `[${keys.map(k => `#${k}`)}]`;
            const scope = `${COLLECTION_SCOPE}:${collectionName}`;
            this.emit('query', {
                query,
                scope
            }).done((data) => {
                this.setState({things: data.reduce((res, d) => {res[d['#']] = d ;return res;}, {})});
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

    onQueryWithReturn(scope, q, thingId, tag, cb) {
        const query = `${q} #${thingId}`;
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

    onRawQuery(scope, query, tag, cb) {
        this.emit('query', {
            query,
            scope
        }).done((data) => {
            cb(data);
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
        });
    }

    onBlob(scope, q, thingId, blob, tag, cb) {
        const query = thingId?`${q} #${thingId}`:`${q}`;
        this.emit('queryBlob', {
            query,
            scope,
            blob,
        }).done((data) => {
            if(thingId){
                this.setState(prevState => {
                    const things = Object.assign({}, prevState.things, {[thingId]: data});
                    return {things};
                });
            }
            cb();
        }).fail((event, status, message) => {
            ErrorActions.setMsgError(tag, message.Log);
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
}

export {CollectionActions, CollectionStore};
