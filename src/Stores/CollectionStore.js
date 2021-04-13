/*eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import Vlow from 'vlow';

import {BaseStore} from './BaseStore';
import {ErrorActions} from './ErrorStore';
// importing any method from Util creates a webpack error.
// import {depthOf} from '../Components/Util';


const CollectionActions = Vlow.createActions([
    'blob',
    'cleanupThings',
    'cleanupTmp',
    'download',
    'getThings',
    'queryWithReturn',
    'rawQuery',
    'refreshThings',
    'removeThing',
    'resetCollectionStore'
]);


class CollectionStore extends BaseStore {

    static types = {
        things: PropTypes.object,
    }

    static defaults = {
        things: {},
    }

    constructor() {
        super(CollectionActions);
        this.state = CollectionStore.defaults;
    }


    onResetCollectionStore() {
        this.setState({
            things: {},
        });
    }

    onGetThings(collectionId, collectionName, thingId=null) {
        console.log('getThings')
        const query = thingId ? `#${thingId}` : 'thing(.id())';
        const scope = `@collection:${collectionName}`;
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
        }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
    }

    onRefreshThings(collectionName) {
        const {things} = this.state;
        const keys = Object.keys(things);

        if(keys.length) {
            console.log('refreshThings')
            const query = `[${keys.map(k => `#${k}`)}]`;
            const scope = `@collection:${collectionName}`;
            this.emit('query', {
                query,
                scope
            }).done((data) => {
                this.setState({things: data.reduce((res, d) => {res[d['#']] = d ;return res;}, {})});
            }).fail((event, status, message) => ErrorActions.setToastError(message.Log));
        }
    }

    onRemoveThing(thingId) {
        if(thingId) {
            console.log('removeThing', thingId)
            this.setState(prevState => {
                let update = {...prevState.things};
                delete update[thingId];
                return {things: {...update}};
            });
        }
    }

    onCleanupThings(collectionId) {
        console.log('cleanupThings')
        const {things} = this.state;
        this.setState({things: {[collectionId]: things[collectionId]}});
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
