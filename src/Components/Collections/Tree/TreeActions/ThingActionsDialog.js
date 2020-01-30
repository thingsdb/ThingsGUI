/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Edit from './Edit';
import RemoveThing from './RemoveThing';
import WatchThings from './WatchThings';
import {ApplicationActions, CollectionActions, ThingsdbActions, TypeActions} from '../../../../Stores';
import {DownloadBlob, ErrorMsg, SimpleModal} from '../../../Util';

const tag = '8';


const ThingActionsDialog = ({open, onClose, child, parent, thing, scope}) => {

    const initialState = {
        customTypes: [],
        query: '',
        blob: {},
        error: '',
        show: false,
        setOrList: '',
        realChildType: '',
        realParentType: '',
    };
    const [state, setState] = React.useState(initialState);
    const {query, blob, error, show, realChildType, realParentType, customTypes} = state;
    const dataTypes = [
        'str',
        'int',
        'float',
        'bool',
        'bytes',
        'closure',
        'regex',
        'error',
        'nil',
        'list',
        'set',
        'thing',
        ...customTypes.map(c=>c.name)
    ];

    React.useEffect(() => {
        // Checks for the real type. From here on array is redefined to list or set. And thing is redefined to its potential custom type.
        // Furthermore we check if the parent has a custom type. In that case we remove the remove button. Custom type instances have no delete options.

        // it would also be nice if we could check for potential custom type childern in an array type. To define the datatype of the edit component.
        let query='';
        if (parent.id==null) {
            query = `{childType: type(#${child.id}), parentType: '', customTypes: types_info()}`; // check if custom type
        } else if (parent.type == 'thing') {
            query = `{childType: type(#${parent.id}.${child.name}), parentType: type(#${parent.id}), customTypes: types_info()}`; // check if custom type
        } else if (child.type == 'thing') {
            query = `{childType: type(#${child.id}), parentType: type(#${parent.id}.${parent.name}), customTypes: types_info()}`; // in case parent is set than indexing is not supported. Therefore we need to check child type by id.
        } else {
            query = `{childType: type(#${parent.id}.${child.name}), parentType: type(#${parent.id}.${parent.name}), customTypes: types_info()}`; // check if custom type
        }
        console.log(query, scope);
        TypeActions.getType(query, scope, tag, setType);

    }, []);

    console.log(customTypes);
    const setType = (t) => {
        console.log(t);
        setState({...state, realChildType: t.childType, realParentType: t.parentType, show: true, customTypes: t.customTypes});
    };

    const handleQuery = (q, b, e) => {
        setState({...state, query: q, blob: b, error: e});
    };

    const handleClickOk = () => {
        if (Object.keys(blob).length) {
            CollectionActions.blob(
                scope,
                query,
                child.id||parent.id,
                blob,
                tag,
                () => {
                    ThingsdbActions.getCollections();
                    onClose();
                },
            );
        } else {
            CollectionActions.queryWithReturn(
                scope,
                query,
                child.id||parent.id,
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
    const isRoot = child.name == 'root';
    const isChildCustom = Boolean(customTypes.find(c=>c.name==realChildType));
    const isParentCustom = Boolean(customTypes.find(c=>c.name==realParentType));
    const canRemove = !(child.name === '/' || parent.isTuple || isRoot || isParentCustom);
    const canEdit = !(parent.isTuple && child.type !== 'thing' || realChildType=='tuple' || isChildCustom || child.type === 'bytes' || realChildType[0]=='<');
    const canWatch = thing && thing.hasOwnProperty('#');
    const canDownload = child.type === 'bytes';


    const content = (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Typography variant="body1" >
                        {'Detail view of:'}
                    </Typography>
                    <Typography variant="h4" color='primary' component='span'>
                        {`${child.name||parent.name}  `}
                    </Typography>
                    <Typography variant="body2" component='span'>
                        {`- ${realChildType||child.type}`}
                    </Typography>
                </Grid>
                <Grid container spacing={1} item xs={4} justify="flex-end">
                    {canRemove &&
                        <Grid item>
                            <RemoveThing
                                scope={scope}
                                thing={thing}
                                child={{...child, type: realChildType}}
                                parent={{...parent, type: realParentType||parent.type}}
                            />
                        </Grid>
                    }
                    <Grid item>
                        <Fab color="primary" onClick={handleClickOpenEditor} >
                            <CodeIcon fontSize="large" />
                        </Fab>
                    </Grid>
                    {canWatch &&
                        <Grid item>
                            <WatchThings
                                buttonIsFab
                                scope={scope}
                                thingId={child.id||parent.id}
                                tag={tag}
                            />
                        </Grid>
                    }
                    {canDownload &&
                        <Grid item>
                            <DownloadBlob
                                val={thing}
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
                            child={{...child, type: realChildType}}
                            parent={{...parent, type: realParentType||parent.type}}
                        />
                    </Grid>
                </React.Fragment>
            ): null}
        </Grid>
    );

    console.log('thingsdialog');

    return (
        <React.Fragment>
            {show ? (
                <SimpleModal
                    open
                    onClose={onClose}
                    onOk={canEdit ? handleClickOk:null}
                    maxWidth="md"
                    disableOk={Boolean(error)}
                >
                    {content}
                </SimpleModal>
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
};

export default ThingActionsDialog;
