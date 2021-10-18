import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AddDialogTAG } from '../../../../Constants/Tags';
import { ArrayLayout, EditProvider, ErrorMsg, SimpleModal, Switching } from '../../../Utils';
import { CollectionActions } from '../../../../Stores';
import { PropertyMethod, PropertyName, PropertyType, PropertyVal } from './AddEditProperty';

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

    const handleBlob = React.useCallback((b) => {
        setBlob(prev => ({...prev, ...b}));
    }, []);

    const handleChange = ({target}) => {
        const {value} = target;
        const qry = queries[category](value, properties);
        setState({...state, name: value, queryString: qry});
    };

    const handleChangeProperty = React.useCallback((index) => (property) => {
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1, {...prevState.properties[index], ...property});
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    }, [category, queries]);

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

    const handleSwitching = React.useCallback((index) => (check) => {
        setState(prevState => {
            const prop = check ? {propertyType: ''} : {definition: ''};
            let update = [...prevState.properties]; // keep the useEffect to prevent infinite render. Combi of map function and fast changes causes mix up of previous and current state updates. Something with not being a deep copy.
            update.splice(index, 1, {...prevState.properties[index], ...prop});
            const qry = queries[category](prevState.name, update);
            return {...prevState, properties: update, queryString: qry};
        });
    }, [category, queries]);


    const handleClickOk = () => {
        const keys = Object.keys(blob || {});
        const b = keys ? keys.reduce((res, k) => {
            if(queryString.includes(k)){
                res[k]=blob[k];
            }
            return res;
        },{}) : null;

        CollectionActions.query(
            scope,
            queryString,
            tag,
            () => {
                getInfo(scope, tag);
                onClose();
            },
            null,
            b,
        );
    };

    const child = React.useCallback((i) => (
        <EditProvider>
            <Grid container item xs={12} spacing={1} alignItems="center" >
                <Grid item xs={12}>
                    <PropertyName onChange={handleChangeProperty(i)} input={properties[i]&&properties[i].propertyName||''} />
                </Grid>
                {category === 'type' ? (
                    <Grid item xs={12}>
                        <Switching
                            one={
                                <PropertyType onChange={handleChangeProperty(i)} dropdownItems={dataTypes} input={properties[i]&&properties[i].propertyType||''} />
                            }
                            two={
                                <PropertyMethod onChange={handleChangeProperty(i)} input={properties[i]&&properties[i].definition||''} />
                            }
                            onChange={handleSwitching(i)}
                        />
                    </Grid>
                ) : null}
                {category === 'enum' ? (
                    <Grid item xs={12}>
                        <PropertyVal category={category} onChange={handleChangeProperty(i)} onBlob={handleBlob} scope={scope} />
                    </Grid>
                ) : null}
            </Grid>
        </EditProvider>
    ), [category, dataTypes, handleBlob, handleChangeProperty, handleSwitching, properties, scope]);

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
                                    fullWidth
                                    label="Query"
                                    multiline
                                    name="queryString"
                                    type="text"
                                    value={queryString}
                                    variant="standard"
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
                                fullWidth
                                label="Name"
                                name="name"
                                onChange={handleChange}
                                spellCheck={false}
                                type="text"
                                value={name}
                                variant="standard"
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
                                child={child}
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

