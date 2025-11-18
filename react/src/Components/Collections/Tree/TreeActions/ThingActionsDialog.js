/* eslint-disable react-hooks/exhaustive-deps */
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { allDataTypes, ErrorMsg, SimpleModal } from '../../../Utils';
import { CollectionActions, EnumActions, ThingsdbActions, TypeActions } from '../../../../Stores';
import { ROOM, THING, TUPLE } from '../../../../Constants/ThingTypes';
import { ThingActionsDialogTAG } from '../../../../Constants/Tags';
import {
    THING_QUERY,
    TYPE_INFO_CHILD_ARRAY_QUERY,
    TYPE_INFO_CHILD_THING_QUERY,
    TYPE_INFO_PARENT_ARRAY_QUERY,
    TYPE_INFO_PARENT_THING_QUERY,
    TYPE_INFO_ROOT_THING_QUERY,
} from '../../../../TiQueries/Queries';
import {
    ID_ARGS,
    TYPE_INFO_CHILD_ARRAY_ARGS,
    TYPE_INFO_CHILD_THING_ARGS,
    TYPE_INFO_PARENT_ARRAY_ARGS,
    TYPE_INFO_PARENT_THING_ARGS,
} from '../../../../TiQueries/Arguments';

import DialogButtons from './DialogButtons';
import Edit from './Edit';
import RoomEvent from './RoomEvent';
import SubmitButton from './SubmitButton';

const tag = ThingActionsDialogTAG;

const initialState = {
    customTypes: [],
    loaded: false,
    setOrList: '',
    realChildType: '',
    realParentType: '',
};

const ThingActionsDialog = ({
    onClose,
    child,
    parent,
    thing = null,
    scope,
    isRoot = false,
}) => {
    const [state, setState] = React.useState(initialState);
    const {loaded, realChildType, realParentType, customTypes} = state;
    const [enums, setEnums] = React.useState([]);
    const dataTypes = allDataTypes([...customTypes, ...enums]);

    const [tabIndex, setTabIndex] = React.useState(0);
    const handleChangeTab = (_event, newValue) => {
        setTabIndex(newValue);
    };

    React.useEffect(() => {
        // Checks for the real type. From here on array is redefined to list or set. And thing is redefined to its potential custom type.
        // Furthermore we check if the parent has a custom type. In that case we remove the remove button. Custom type instances have no delete options.

        // it would also be nice if we could check for potential custom type childern in an array type. To define the datatype of the edit component.
        let query = '';
        let jsonArgs = null;

        if (parent.id==null) {
            query = TYPE_INFO_ROOT_THING_QUERY;
            jsonArgs = ID_ARGS(child.id);
        } else if (parent.type == THING) {
            query = TYPE_INFO_PARENT_THING_QUERY;
            jsonArgs = TYPE_INFO_PARENT_THING_ARGS(parent.id, child.name);
        } else if (child.type == THING) {
            query = TYPE_INFO_CHILD_THING_QUERY; // in case parent is set than indexing is not supported. Therefore we need to check child type by id.
            jsonArgs = TYPE_INFO_CHILD_THING_ARGS(child.id, parent.id, parent.name);
        } else if (parent.index == null) {
            query = TYPE_INFO_CHILD_ARRAY_QUERY;
            jsonArgs = TYPE_INFO_CHILD_ARRAY_ARGS(parent.id, parent.pname, child.index);
        } else {
            query = TYPE_INFO_PARENT_ARRAY_QUERY;
            // pname is the property name without any index indication; so `arr` instead of `arr[2]`
            jsonArgs = TYPE_INFO_PARENT_ARRAY_ARGS(parent.id, parent.index, parent.pname, child.index);
        }
        TypeActions.getType(query, scope, jsonArgs, tag, setType);
        EnumActions.getEnums(scope, tag, setEnums);

    }, []);

    const setType = (t) => {
        const [realChildType, realParentType, customTypes] = t;
        setState({...state, realChildType, realParentType, customTypes, loaded: true});
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
            query + ' ' + THING_QUERY,
            tag,
            () => {
                ThingsdbActions.getCollections();
                onClose();
            },
            tid,
            b,
            ID_ARGS(tid)
        );
    };

    // buttons visible
    const isChildCustom = Boolean(customTypes.find(c=>c.name==realChildType));
    const canEdit = !(isChildCustom || realChildType==TUPLE || realChildType[0]=='<' || parent.isTuple && child.type !== THING);
    const showRoomEvents = realChildType === ROOM;

    const content = (
        <Grid container spacing={1}>
            <Grid container spacing={1} size={12}>
                <Grid size={8}>
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
                <Grid container spacing={1} size={4} justifyContent="flex-end">
                    <DialogButtons child={child} customTypes={customTypes} onClose={onClose} parent={parent} realChildType={realChildType} realParentType={realParentType} scope={scope} tag={tag} thing={thing} isRoot={isRoot} />
                </Grid>
            </Grid>
            {!isRoot && showRoomEvents && (
                <Tabs value={tabIndex} onChange={handleChangeTab} indicatorColor="primary" aria-label="styled tabs example">
                    {canEdit && <Tab label="Edit" />}
                    {showRoomEvents && <Tab label="Room events" />}
                </Tabs>
            )}
            {tabIndex === 0 && canEdit && (
                <React.Fragment>
                    <Grid size={12}>
                        <ErrorMsg tag={tag} />
                    </Grid>
                    <Grid size={12}>
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
            )}
            {tabIndex === 1 && showRoomEvents &&
                <Grid size={12}>
                    <RoomEvent room={thing} />
                </Grid>}
        </Grid>
    );

    return (
        <SimpleModal
            open
            onClose={onClose}
            maxWidth="xl"
            fullWidth={false}
            actionButtons={tabIndex === 0 && canEdit ? <SubmitButton onClickSubmit={handleClickOk} />: null}
            sx={{ '& .MuiDialog-paper': { minWidth: '600px' } }}
        >
            {loaded ? content : (
                <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid size={6}>
                        <Typography variant="h6" color="textSecondary">
                            {'Loading...'}
                        </Typography>
                    </Grid>
                    <Grid size={6}>
                        <CircularProgress size={50} />
                    </Grid>
                </Grid>
            )}
        </SimpleModal>
    );
};

ThingActionsDialog.propTypes = {
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        pname: PropTypes.string,
        type: PropTypes.string,
        val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    isRoot: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        isTuple: PropTypes.bool,
        name: PropTypes.string,
        pname: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default ThingActionsDialog;
