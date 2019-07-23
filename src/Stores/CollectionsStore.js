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

    onGetCollections() {
        this.emit('/collection/getcollections').done((data) => {
            this.setState({
                collections: data
            });
        });
    }

    onGetCollection({name}) {
        this.emit('/collection/get', {
            name,
        }).done((data) => {
            this.setState({
                collection: data
            });
        });
    }
   
    onAddCollection({name}) {
        this.emit('/collection/add', {
            name,
        }).done((data) => {
            this.setState({
                collections: data
            });
        });
    }
    
    onRenameCollection({oldname, newname}) {
        this.emit('/collection/rename', {
            oldname,
            newname,
        }).done((data) => {
            this.setState({
                collections: data
            });
        });
    }

    onRemoveCollection({name}) {
        this.emit('/collection/remove', {
            collection,
        }).done((data) => {
            this.setState({
                collections: data
            });
        });
    }

    onSetQuota({name, quotaType, quota}) {
        emit('/collection/setquota', {
            name,
            quotaType,
            quota,
        }).done((data) => {
            this.setState({
                collections: data
            });
        });
    }
}

export {CollectionsActions, CollectionsStore};