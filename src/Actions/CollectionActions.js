import { emit } from './BaseActions';
import { getGlobal, setGlobal } from 'reactn';


const CollectionActions = {
    query: (collectionId, thingId=null, depth=1) => {
        emit('/collection/query', {
            collectionId: collectionId,
            thingId: thingId,
            depth: depth
        }).done((data) => {
            const things = thingId ?
                Object.assign({}, getGlobal().things, {[thingId]: data})
                :
                Object.assign({}, getGlobal().things, {[collectionId]: data});
            setGlobal({
                things: things,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    removeThing: (config) => {
        emit('/collection/remove-thing', config).done((data) => {
            const things = Object.assign({}, getGlobal().things, {[config.thingId]: data});
            setGlobal({
                things: things,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    rawQuery: (collectionId, thingId, query) => {
        emit('/collection/raw-query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            const things = Object.assign({}, getGlobal().things, {[thingId]: data});
            setGlobal({
                things: things,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    },

    queryWithOutput: (collectionId, query, onOutput) => {
        emit('/collection/query-with-output', {
            collectionId: collectionId,
            query: query,
        }).done((data) => {
            onOutput(data.output);

            const things = Object.assign({}, getGlobal().things, {[collectionId]: data.things});
            setGlobal({
                things: things,
            });
        }).fail((event, status, message) => setGlobal({
            error: message,
        }));
    }
};

export default CollectionActions;
