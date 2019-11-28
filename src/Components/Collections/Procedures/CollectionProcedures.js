import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import {withVlow} from 'vlow';

import {ProcedureActions, ProcedureStore} from '../../../Stores';
import {ChipsCard} from '../../Util';

const withStores = withVlow([{
    store: ProcedureStore,
    keys: ['procedures']
}]);
const tag = '21';

const CollectionProcedures = ({scope, procedures}) => {
    const [index, setindex] = React.useState(null);

    React.useEffect(() => {
        ProcedureActions.getProcedures(scope, tag);

    }, [scope]);

    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);


    const handleClickEdit = (i) => {
        setindex(i);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleClickAdd = () => {
        setindex(null);
        setOpenAdd(true);
    };
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };
    const handleClickDelete = (i) => {
        const item = procedures[i];
        ProcedureActions.deleteType(scope, item.name, tag);
    };

    return (
        <React.Fragment>
            <ChipsCard
                title="custom types"
                items={procedures}
                onAdd={handleClickAdd}
                onClick={handleClickEdit}
                onDelete={handleClickDelete}
                tag={tag}
            />
            {/* <AddTypeDialog open={openAdd} onClose={handleCloseAdd} dataTypes={datatypesMap} scope={scope} />
            <EditTypeDialog open={openEdit} onClose={handleCloseEdit} customType={index!=null?typesArr[index]:{}} dataTypes={datatypesMap} scope={scope} /> */}
        </React.Fragment>
    );
};

CollectionProcedures.propTypes = {
    scope: PropTypes.string.isRequired,

    // procedures store
    procedures: ProcedureStore.types.procedures.isRequired,
};

export default withStores(CollectionProcedures);
