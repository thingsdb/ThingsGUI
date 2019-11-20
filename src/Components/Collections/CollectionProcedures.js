import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import {withVlow} from 'vlow';

import {ProcedureActions, ProcedureStore} from '../../Stores/ProcedureStore';
import {HarmonicCard, ThingsTree} from '../Util';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);
const tag = '21';

const CollectionProcedures = ({collection, procedures}) => {

    React.useEffect(() => {
        ProcedureActions.getProcedures(`@collection:${collection.name}`, tag);

    }, [collection]);

    return (
        <HarmonicCard
            title="PROCEDURES"
            content={
                <List
                    component="nav"
                    dense
                    disablePadding
                >
                    <ThingsTree
                        tree={procedures}
                        child={{
                            name:'',
                            index:null,
                        }}
                        root
                    />
                </List>
            }
        />
    );
};

CollectionProcedures.propTypes = {
    collection: PropTypes.object.isRequired,

    // procedures store
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(CollectionProcedures);