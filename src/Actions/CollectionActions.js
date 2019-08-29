import BaseActions from './BaseActions';

export default class CollectionActions extends BaseActions {
    query(collectionId, thingId=null, depth=1) {
        this.emit('/collection/query', {
            collectionId: collectionId,
            thingId: thingId,
            depth: depth
        }).done((data) => {
            const things = thingId ?
                Object.assign({}, this.global.things, {[thingId]: data})
                :
                Object.assign({}, this.global.things, {[collectionId]: data});
            this.setGlobal({
                things: things,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    removeThing(config) {
        this.emit('/collection/remove-thing', config).done((data) => {
            const things = Object.assign({}, this.global.things, {[config.thingId]: data});
            this.setGlobal({
                things: things,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    rawQuery(collectionId, thingId, query) {
        this.emit('/collection/raw-query', {
            collectionId: collectionId,
            thingId: thingId,
            query: query,
        }).done((data) => {
            const things = Object.assign({}, this.global.things, {[thingId]: data});
            this.setGlobal({
                things: things,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }

    queryWithOutput(collectionId, query, onOutput) {
        this.emit('/collection/query-with-output', {
            collectionId: collectionId,
            query: query,
        }).done((data) => {
            onOutput(data.output);

            const things = Object.assign({}, this.global.things, {[collectionId]: data.things});
            this.setGlobal({
                things: things,
            });
        }).fail((event, status, message) => this.setGlobal({
            error: message,
        }));
    }
}
