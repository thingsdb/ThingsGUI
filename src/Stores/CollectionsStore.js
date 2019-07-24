import PropTypes from 'prop-types';
import Vlow from 'vlow';
import BaseStore from './BaseStore';

const CollectionsActions = Vlow.createActions([
    'getColections',
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
    }

    onGetCollections(onError) {
        this.emit('/collection/getcollections').done((data) => {
            this.setState({
                collections: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onGetCollection(name, onError) {
        this.emit('/collection/get', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }
   
    onAddCollection(name, onError) {
        this.emit('/collection/add', {
            name,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }
    
    onRenameCollection(oldname, newname, onError) {
        this.emit('/collection/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onRemoveCollection(name, onError) {
        this.emit('/collection/remove', {
            collection,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }

    onSetQuota(name, quotaType, quota, onError) {
        emit('/collection/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
        }).fail((_xhr, {error}) => onError(error));
    }
}

export {CollectionsActions, CollectionsStore};