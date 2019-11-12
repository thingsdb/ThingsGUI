/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import CodeIcon from '@material-ui/icons/Code';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withVlow} from 'vlow';

import Edit from './Edit';
import RemoveThing from './RemoveThing';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {ErrorMsg, WatchThings} from '../Util';


const withStores = withVlow([{
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = '1';

const ThingActionsDialog = ({open, onClose, child, parent, thing, scope, customTypes}) => {
    const dataTypes = [
        'string',
        'number',
        'boolean',
        'blob',
        'closure',
        'nil',
        'list',
        'set',
        'thing',
        ...Object.keys(customTypes)
    ];

    const initialState = {
        query: '',
        blob: '',
        error: '',
        show: false,
        setOrList: '',
        realChildType: '',
        realParentType: '',
    };
    const [state, setState] = React.useState(initialState);
    const {query, blob, error, show, realChildType, realParentType} = state;

    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);

        // Checks for the real type. From here on the array is redefined to list or set. And thing is redefined to its potential custom type.
        // Furthermore we check if the parent has a custom type. In that case we remove the remove button. Custom type instances have no delete options.

        // it would also be nice if we could check for potential custom type childeren in an array type. To force the datatype of the edit component to that type.
        if (child.type == 'array') {                                        // check if it is a list or set
            TypeActions.getType(`{childType: type(#${parent.id}.${child.name}), parentType: type(#${parent.id})}`,scope, tag, setType);
        } else if (child.type == 'thing') {
            if (child.id&&parent.id) {
                TypeActions.getType(`{childType: type(#${child.id}), parentType: type(#${parent.id})}`,scope, tag, setType); // check if custom type
            } else {
                setState({...state, show: true});
            }
        } else {
            TypeActions.getType(`{parentType: type(#${parent.id})}`,scope, tag, setParentType);
        }

    }, []);

    const setParentType = (t) => {
        setState({...state, realParentType: t.parentType, show: true});
    };

    const setType = (t) => {
        setState({...state, realChildType: t.childType, realParentType: t.parentType, show: true});
    };

    const handleQuery = (q, b, e) => {
        setState({...state, query: q, blob: b, error: e});
    };

    const handleClickOk = () => {
        if (blob) {
            CollectionActions.blob(
                scope,
                child.id||parent.id,
                query,
                blob,
                tag,
                () => {
                    ThingsdbActions.getCollections();
                    onClose();
                },
            );
        } else {
            CollectionActions.rawQuery(
                scope,
                child.id||parent.id,
                query,
                tag,
                () => {
                    ThingsdbActions.getCollections();
                    onClose();
                }
            );
        }
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: child.type==='thing' ? `#${child.id}` : `#${parent.id}.${child.name}`, scope: scope});
    };

    // buttons visible
    const isRoot = child.name == 'root';
    const isChildCustom = customTypes.hasOwnProperty(realChildType);
    const isParentCustom = customTypes.hasOwnProperty(realParentType);
    const canRemove = !(child.name === '/' || parent.isTuple || isRoot || isParentCustom);
    const canEdit = !(parent.isTuple && child.type !== 'thing' || isChildCustom);
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <React.Fragment>
            {show ? (
                <Dialog
                    open={open}
                    onClose={onClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth="md"
                    scroll="body"
                    onKeyDown={handleKeyPress}
                >
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid container spacing={1} item xs={12}>
                                <Grid item xs={8}>
                                    <Typography variant="body1" >
                                        {'Detail view of:'}
                                    </Typography>
                                    <Typography variant="h4" color='primary'>
                                        {`${child.name||parent.name} --- ${realChildType||child.type}`}
                                    </Typography>
                                </Grid>
                                <Grid container spacing={1} item xs={4} justify="flex-end">
                                    {canRemove &&
                                        <Grid item>
                                            <RemoveThing
                                                scope={scope}
                                                thing={thing}
                                                child={{...child, type: child.type == 'array'?realChildType:child.type}}
                                                parent={parent}
                                            />
                                        </Grid>
                                    }
                                    <Grid item>
                                        <Fab color="secondary" onClick={handleClickOpenEditor} >
                                            <CodeIcon fontSize="large" />
                                        </Fab>
                                    </Grid>
                                    {canWatch &&
                                    <Grid item>
                                        <WatchThings
                                            buttonIsFab
                                            scope={scope}
                                            thingId={child.id||parent.id}
                                        />
                                    </Grid>
                                    }
                                </Grid>
                            </Grid>
                            {canEdit ? (
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <ErrorMsg tag={tag} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Edit
                                            cb={handleQuery}
                                            customTypes={customTypes}
                                            dataTypes={dataTypes}
                                            thing={thing}
                                            child={{...child, type: realChildType||child.type}}
                                            parent={parent}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ): null}
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            {'Close'}
                        </Button>
                        {canEdit ? (
                            <Button onClick={handleClickOk} disabled={Boolean(error)} color="primary">
                                {'Submit'}
                            </Button>
                        ) : null}
                    </DialogActions>
                </Dialog>
            ) : null}
        </React.Fragment>
    );
};

ThingActionsDialog.defaultProps = {
    thing: null,
};


ThingActionsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
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

    // types store
    customTypes: TypeStore.types.customTypes.isRequired,
};

export default withStores(ThingActionsDialog);
