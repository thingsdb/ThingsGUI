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
        'array',
        'set',
        'thing',
        ...Object.keys(customTypes)
    ];

    const initialState = {
        query: '',
        blob: '',
        error: '',
    };
    const [state, setState] = React.useState(initialState);
    const {query, blob, error} = state;

    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);
    }, []);

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


    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: child.type==='thing' ? `#${child.id}` : `#${parent.id}.${child.name}`, scope: scope});
    };

    // buttons visible
    const isRoot = !(child.name||parent.name);
    const canRemove = !(child.type === 'array' && child.name === '$' || child.name === '>' || parent.isTuple || isRoot);
    const canEdit = !(parent.isTuple && child.type !== 'thing');
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            fullWidth
            maxWidth="md"
        >
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={8}>
                            <Typography variant="body1" >
                                {'Detail view of:'}
                            </Typography>
                            <Typography variant="h4" color='primary'>
                                {child.name||parent.name||'Root'}
                            </Typography>
                        </Grid>
                        <Grid container spacing={1} item xs={4}justify="flex-end">
                            {canRemove &&
                                <Grid item>
                                    <RemoveThing
                                        scope={scope}
                                        thing={thing}
                                        child={{
                                            index: child.index,
                                            name: child.name,
                                        }}
                                        parent={{
                                            id: parent.id,
                                            name: parent.name,
                                            type: parent.type
                                        }}
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
                                    child={child}
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
