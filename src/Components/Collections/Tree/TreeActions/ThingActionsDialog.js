/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import DialogButtons from './DialogButtons';
import Edit from './Edit';
import SubmitButton from './SubmitButton';
import {CollectionActions, EnumActions, ThingsdbActions, TypeActions} from '../../../../Stores';
import {allDataTypes, ErrorMsg, SimpleModal} from '../../../Util';
import {ThingActionsDialogTAG} from '../../../../Constants/Tags';
import {THING, TUPLE} from '../../../../Constants/ThingTypes';

const tag = ThingActionsDialogTAG;

const ThingActionsDialog = ({onClose, child, parent, thing, scope, isRoot}) => {

    const initialState = {
        customTypes: [],
        show: false,
        setOrList: '',
        realChildType: '',
        realParentType: '',
    };

    const [state, setState] = React.useState(initialState);
    const {show, realChildType, realParentType, customTypes} = state;
    const [enums, setEnums] = React.useState([]);
    const dataTypes = allDataTypes([...customTypes, ...enums]);

    React.useEffect(() => {
        // Checks for the real type. From here on array is redefined to list or set. And thing is redefined to its potential custom type.
        // Furthermore we check if the parent has a custom type. In that case we remove the remove button. Custom type instances have no delete options.

        // it would also be nice if we could check for potential custom type childern in an array type. To define the datatype of the edit component.
        let query='';
        if (parent.id==null) {
            query = `{childType: type(#${child.id}), parentType: '', customTypes: types_info()}`; // check if custom type
        } else if (parent.type == THING) {
            query = `{childType: type(#${parent.id}.${child.name}), parentType: type(#${parent.id}), customTypes: types_info()}`; // check if custom type
        } else if (child.type == THING) {
            query = `{childType: type(#${child.id}), parentType: type(#${parent.id}.${parent.name}), customTypes: types_info()}`; // in case parent is set than indexing is not supported. Therefore we need to check child type by id.
        } else {
            query = `{childType: type(#${parent.id}.${child.name}), parentType: type(#${parent.id}.${parent.name}), customTypes: types_info()}`; // check if custom type
        }
        TypeActions.getType(query, scope, tag, setType);
        EnumActions.getEnums(scope, tag, setEnums);

    }, []);

    const setType = (t) => {
        setState({...state, realChildType: t.childType, realParentType: t.parentType, show: true, customTypes: t.customTypes});
    };

    const handleClickOk = (blob, query) => {
        const keys = Object.keys(blob || {});
        const b = keys ? keys.reduce((res, k) => {
            if(query.includes(k)){
                res[k]=blob[k];
            }
            return res;
        },{}) : null;
        const isChildEnum = Boolean(enums.find(c=>c.name==realChildType));
        const useParent = isChildEnum&&child.id;
        const tid = useParent?parent.id:child.id||parent.id;

        CollectionActions.query(
            scope,
            query,
            tag,
            () => {
                ThingsdbActions.getCollections();
                onClose();
            },
            tid,
            b,
        );
    };

    // buttons visible
    const isChildCustom = Boolean(customTypes.find(c=>c.name==realChildType));
    const canEdit = !(isChildCustom || realChildType==TUPLE || realChildType[0]=='<' || parent.isTuple && child.type !== THING);

    const content = (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {'Detail view of:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span' noWrap display="block">
                        {`${child.name||parent.name}  `}
                    </Typography>
                    <Typography variant="body2" component='span'>
                        {`- ${realChildType||child.type}`}
                    </Typography>
                </Grid>
                <Grid container spacing={1} item xs={4} justify="flex-end">
                    <DialogButtons child={child} customTypes={customTypes} onClose={onClose} parent={parent} realChildType={realChildType} realParentType={realParentType} scope={scope} thing={thing} isRoot={isRoot} />
                </Grid>
            </Grid>
            {canEdit ? (
                <React.Fragment>
                    <Grid item xs={12}>
                        <ErrorMsg tag={tag} />
                    </Grid>
                    <Grid item xs={12}>
                        <Edit
                            customTypes={customTypes}
                            dataTypes={dataTypes}
                            enums={enums}
                            thing={thing}
                            child={{...child, type: realChildType}}
                            parent={{...parent, type: realParentType||parent.type}}
                            scope={scope}
                        />
                    </Grid>
                </React.Fragment>
            ): null}
        </Grid>
    );

    return (
        show ? (
            <SimpleModal
                open
                onClose={onClose}
                maxWidth="md"
                actionButtons={canEdit ? <SubmitButton onClickSubmit={handleClickOk} />:null}
            >
                {content}
            </SimpleModal>
        ) : null
    );
};

ThingActionsDialog.defaultProps = {
    thing: null,
    isRoot: false,
};


ThingActionsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    isRoot: PropTypes.bool,
};

export default ThingActionsDialog;
