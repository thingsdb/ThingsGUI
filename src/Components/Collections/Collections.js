/* eslint-disable react/no-multi-comp */
import React from 'react';

import AddCollection from './Add';
import CollectionExtend from './CollectionExtend';
import Table from '../Util/Table2';
import {useStore} from '../../Stores/ApplicationStore';


const Collections = () => {
    const [store, dispatch] = useStore();
    const {collections} = store;
    
    const rows = collections;
    const header = [{
        ky: 'name',
        label: 'Collection',
    }, {
        ky: 'things',
        label: '# Things',
    }];
    const rowClick = (collection) => {
        dispatch(() => ({match: {path: 'collection', collection}}));
    };
    const rowExtend = (collection) => <CollectionExtend collection={collection} />;
        
    return (
        <React.Fragment>
            <Table header={header} rows={rows} rowClick={rowClick} rowExtend={rowExtend} />
            <AddCollection />
        </React.Fragment>
    );
};

export default Collections;