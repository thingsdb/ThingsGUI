/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import {allDataTypes, ErrorMsg, SimpleModal, TabView} from '../../../Util';
import {CollectionActions, EnumActions, ThingsdbActions, TypeActions} from '../../../../Stores';
import {ROOM, THING, TUPLE} from '../../../../Constants/ThingTypes';
import {ThingActionsDialogTAG} from '../../../../Constants/Tags';
import DialogButtons from './DialogButtons';
import Edit from './Edit';
import RoomEvent from './RoomEvent';
import SubmitButton from './SubmitButton';

const tag = ThingActionsDialogTAG;

const ThingActionsDialog = ({onClose, child, parent, thing, scope, isRoot}) => {

    const initialState = {
        customTypes: [],
        loaded: false,
        setOrList: '',
        realChildType: '',
        realParentType: '',
    };

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
        setState({...state, realChildType: t.childType, realParentType: t.parentType, loaded: true, customTypes: t.customTypes});
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
    const showRoomEvents = realChildType === ROOM;

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
            )}
            {tabIndex === 1 && showRoomEvents &&
                <Grid item xs={12}>
                    <RoomEvent room={thing} />
                </Grid>}
        </Grid>
    );

    return (
        <SimpleModal
            open
            onClose={onClose}
            maxWidth="md"
            actionButtons={tabIndex === 0 && canEdit ? <SubmitButton onClickSubmit={handleClickOk} />: null}
        >
            {loaded ? content : (
                <Box
                    top={10}
                    left={0}
                    bottom={10}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress size={50} />
                    <Typography align="right" variant="h6" component="div" color="textSecondary">
                        {'Loading...'}
                    </Typography>
                </Box>
            )}
        </SimpleModal>
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
        val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    isRoot: PropTypes.bool,
};

export default ThingActionsDialog;
