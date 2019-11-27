import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import {withVlow} from 'vlow';

import {ProcedureActions, ProcedureStore} from '../../../Stores';
import {HarmonicCard, ThingsTree} from '../../Util';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);
const tag = '21';

const CollectionProcedures = ({scope, procedures}) => {

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope, tag);

    }, [scope]);

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
    scope: PropTypes.string.isRequired,

    // procedures store
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(CollectionProcedures);