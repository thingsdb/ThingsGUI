import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {AddDialogTAG} from '../../../../Constants/Tags';
import {ArrayLayout, ErrorMsg, SimpleModal, Switching} from '../../../Util';
import {CollectionActions} from '../../../../Stores';
import {EditProvider} from '../Context';
import {PropertyMethod, PropertyName, PropertyType, PropertyVal} from './AddEditProperty';

const tag = AddDialogTAG;

const initState = {
    queryString: '',
    name: '',
    error: '',
    properties: [{propertyName: '', propertyType: '', propertyVal: '', definition: ''}],
};

const AddDialog = ({dataTypes, category, getInfo, link, onClose, open, queries, scope}) => {
    const [state, setState] = React.useState(initState);
    const {queryString, name, error, properties} = state;
    const [blob, setBlob] = React.useState({});

    React.useEffect(() => {
        setState(initState);
    },
    [open],
    );

    const handleBlob = (b) => {
        setBlob({...blob, ...b});
    };

    const handleChange = ({target}) => {
        const {value} = target;
        const qry = queries[category](value, properties);
        setState({...state, name: value, queryString: qry});
    };

    const handleChangeProperty = (index) => (property) => {
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1, {...prevState.properties[index], ...property});
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    };

    const handleAdd = (index) => {
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1, {propertyName: '', propertyType: '', propertyVal: '', definition: ''});
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    };

    const handleRemove = (index) => {
        if(category === 'enum'){
            setBlob(prevBlob => {
                let val = properties[index].propertyVal;
                let update = {...prevBlob};
                delete update[val];
                return {...update};
            });
        }
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1);
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    };

    const handleSwitching = (index) => (check) => {
        setState(prevState => {
            const prop = check ? {propertyType: ''} : {definition: ''};
            let update = [...prevState.properties]; // keep the useEffect to prevent infinite render. Combi of map function and fast changes causes mix up of previous and current state updates. Something with not being a deep copy.
            update.splice(index, 1, {...prevState.properties[index], ...prop});
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    };


    const handleClickOk = () => {
        const b = Object.keys(blob || {}).reduce((res, k) => {
            if(queryString.includes(k)){
                res[k]=blob[k];
            }
            return res;
        },{});

        if (Object.keys(b).length) {
            CollectionActions.blob(
                scope,
                queryString,
                null,
                b,
                tag,
                () => {
                    getInfo(scope, tag);
                    onClose();
                }
            );
        } else {
            CollectionActions.rawQuery(
                scope,
                queryString,
                tag,
                () => {
                    getInfo(scope, tag);
                    onClose();
                }
            );
        }
    };

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={handleClickOk}
            maxWidth="md"
            disableOk={Boolean(error)}
        >
            <Grid container spacing={1}>
                <Grid container spacing={1} item xs={12}>
                    <Grid item xs={8}>
                        <Typography variant="body1" >
                            {`Customizing ThingDB ${category}:`}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {`Add new ${category}`}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <Collapse in={Boolean(queryString)} timeout="auto">
                            <ListItem>
                                <TextField
                                    name="queryString"
                                    label="Query"
                                    type="text"
                                    value={queryString}
                                    fullWidth
                                    multiline
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    inputProps={{
                                        style: {
                                            fontFamily: 'monospace',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </ListItem>
                        </Collapse>
                        <ListItem>
                            <TextField
                                name="name"
                                label="Name"
                                type="text"
                                value={name}
                                spellCheck={false}
                                onChange={handleChange}
                                fullWidth
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Add properties"
                                secondary={
                                    <Link target="_blank" href={link}>
                                        {'ThingsDocs'}
                                    </Link>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ArrayLayout
                                child={(i) => (
                                    <EditProvider>
                                        <Grid container item xs={12} spacing={1} alignItems="center" >
                                            <Grid item xs={12}>
                                                <PropertyName onChange={handleChangeProperty(i)} input={properties[i]&&properties[i].propertyName||''} />
                                            </Grid>
                                            {category === 'type' ? (
                                                <Switching
                                                    one={
                                                        <PropertyType onChange={handleChangeProperty(i)} dropdownItems={dataTypes} input={properties[i]&&properties[i].propertyType||''} />
                                                    }
                                                    two={
                                                        <PropertyMethod onChange={handleChangeProperty(i)} input={properties[i]&&properties[i].definition||''} />
                                                    }
                                                    onChange={handleSwitching(i)}
                                                />
                                            ) : null}
                                            {category === 'enum' ? (
                                                <Grid item xs={12}>
                                                    <PropertyVal category={category} onChange={handleChangeProperty(i)} onBlob={handleBlob} scope={scope} />
                                                </Grid>
                                            ) : null}
                                        </Grid>
                                    </EditProvider>
                                )}
                                fullWidth={category === 'enum'}
                                onAdd={handleAdd}
                                onRemove={handleRemove}
                            />
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};


AddDialog.defaultProps = {
    dataTypes: [],
    open: false,
};


AddDialog.propTypes = {
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    getInfo: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    queries: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default AddDialog;

