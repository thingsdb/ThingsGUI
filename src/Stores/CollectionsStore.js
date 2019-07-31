import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionsActions = Vlow.createActions([
    'getCollections',
    'getCollection',
    'addCollection',
    'renameCollection',
    'removeCollection',
    'setQuota',
]);

// TODO: CALLBACKS
class CollectionsStore extends BaseStore {

    static types = {
        collections: PropTypes.arrayOf(PropTypes.object),
        collection: PropTypes.object,
    }

    static defaults = {
        collections: [],
        collection: {},
    }

    constructor() {
        super(CollectionsActions);
        this.state = CollectionsStore.defaults;
        this.onGetCollections();
    }

    onGetCollections() {
        this.emit('/collection/getcollections').done((data) => {
            this.setState({collections: data});
        });
    }

    onGetCollection(name, onError) {
        this.emit('/collection/get', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
            // onError('')
        }).fail((event, status, message) => onError(message));
    }
   
    onAddCollection(name, onError) {
        this.emit('/collection/add', {
            name,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((event, status, message) => onError(message));
    }
    
    onRenameCollection(oldname, newname, onError) {
        this.emit('/collection/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onRemoveCollection(name, onError) {
        this.emit('/collection/remove', {
            name,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((event, status, message) => onError(message));
    }

    onSetQuota(name, quotaType, quota, onError) {
        this.emit('/collection/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((event, status, message) => onError(message));
    }
}

export {CollectionsActions, CollectionsStore};