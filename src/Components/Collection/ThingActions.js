/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import BuildIcon from '@material-ui/icons/Build';
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
import {CollectionActions, CollectionStore} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {TypeActions, TypeStore} from '../../Stores/TypeStore';
import {ErrorMsg, WatchThings} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}, {
    store: TypeStore,
    keys: ['customTypes']
}]);

const tag = '1';

const ThingActions = ({child, parent, thing, scope, customTypes}) => {
    const dataTypes = [
        'string',
        'number',
        'array',
        'thing',
        'set',
        'closure',
        'boolean',
        'nil',
        'blob',
        ...Object.keys(customTypes)
    ];

    const initialState = {
        show: false,
        query: '',
        blob: '',
    };
    const [state, setState] = React.useState(initialState);
    const {show, query, blob} = state;

    React.useEffect(() => {
        TypeActions.getTypes(scope, tag);
    }, []);


    const handleClickOpen = () => {
        setState({
            show: true,
            query: '',
            blob: '',
        });
    };


    const handleClickClose = () => {
        setState({...state, show: false});
    };

    const handleQuery = (q, b) => {
        setState({...state, query: q, blob: b});
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
                    setState({...state, show: false});
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
                    setState({...state, show: false});
                }
            );
        }
    };

    // thing info
    const isTuple = parent.type === 'array' && child.type  === 'array';

    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: child.type==='thing' ? `#${child.id}` : `#${parent.id}.${child.name}`, scope: scope});
    };

    // buttons visible

    const hasButtons = !(child.type === 'array' && child.name === '$' || child.name === '>' || parent.isTuple);
    const canAdd = (child.type === 'array' || child.type === 'thing' || child.type === 'set') && !isTuple;
    const canEdit = child.name !== '$';
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <React.Fragment>
            <ButtonBase onClick={handleClickOpen} >
                <BuildIcon color="primary" />
            </ButtonBase>
            {show ? (
                <Dialog
                    open={show}
                    onClose={handleClickClose}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid container spacing={1} item xs={10}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" >
                                        {'Detail view of:'}
                                    </Typography>
                                    <Typography variant="h4" color='primary'>
                                        {child.name||parent.name||'Root'}
                                    </Typography>
                                </Grid>
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
                            </Grid>
                            <Grid container spacing={1} item xs={2}>
                                {hasButtons &&
                                    <Grid item xs={12} container alignContent="center">
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
                                <Grid item xs={12} container alignContent="center">
                                    <Fab color="secondary" onClick={handleClickOpenEditor} >
                                        <CodeIcon fontSize="large" />
                                    </Fab>
                                </Grid>
                                {canWatch &&
                                    <Grid item xs={12} container alignContent="center">
                                        <WatchThings
                                            buttonIsFab
                                            scope={scope}
                                            thingId={child.id||parent.id}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={handleClickClose} color="primary">
                            {'Cancel'}
                        </Button>
                        <Button onClick={handleClickOk} color="primary">
                            {'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}
        </React.Fragment>
    );
};

ThingActions.defaultProps = {
    thing: null,
};


ThingActions.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    parent: PropTypes.shape({
        id: PropTypes.number,
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

export default withStores(ThingActions);
