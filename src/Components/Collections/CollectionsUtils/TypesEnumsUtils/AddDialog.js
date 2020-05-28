/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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

import {AddDialogTAG} from '../../../../constants';
import {ArrayLayout, ErrorMsg, SimpleModal} from '../../../Util';
import {CollectionActions} from '../../../../Stores';
import {EditProvider} from '../Context';
import AddProperty from './AddProperty';

const tag = AddDialogTAG;

const AddDialog = ({dataTypes, category, getInfo, link, onClose, open, scope}) => {

    const [state, setState] = React.useState({
        queryString: '',
        name: '',
        error: '',
        properties: [{propertyName: '', propertyType: '', propertyVal: ''}],
        blob: {}
    });
    const {queryString, name, error, properties, blob} = state;


    React.useEffect(() => {
        setState({
            queryString: '',
            name: '',
            error: '',
            properties: [{propertyName: '', propertyType: '', propertyVal: ''}],
            blob: {}
        });
    },
    [open],
    );

    React.useEffect(() => { // keep this useEffect to prevent infinite render. Combi of map function and fast changes causes mix up of previous and current state updates. Something with not being a deep copy.
        setState({...state, queryString: `set_${category}("${name}", {${properties.map(v=>`${v.propertyName}: ${category=='type'?`'${v.propertyType}'`:`${v.propertyVal}`}`)}})`});
    },
    [name, JSON.stringify(properties)], // TODO STRING
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, name: value});
    };

    const handleChangeProperty = (index) => (property, blob) => {
        setState(prevState => {
            let update = [...prevState.properties]; // keep the useEffect to prevent infinite render. Combi of map function and fast changes causes mix up of previous and current state updates. Something with not being a deep copy.
            update.splice(index, 1, property);
            return {...prevState, properties: update, blob: {...prevState.blob, ...blob}};
        });
    };

    const handleRemove = (index) => {
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1);
            return {...prevState, properties: update};
        });
    };

    const handleClickOk = () => {
        const b = Object.keys(blob || {}).reduce((res, k) => {if(queryString.includes(k)){res[k]=blob[k];} return res;},{});
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
                (_data) => {
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
                                        {link}
                                    </Link>
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <ArrayLayout
                                child={(i) => (
                                    <EditProvider>
                                        <AddProperty category={category} cb={handleChangeProperty(i)} dropdownItems={dataTypes} input={properties[i]||{propertyName:'', propertyType:'', propertyVal:''}} hasType={category=='type'} hasInitVal={category=='enum'} scope={scope} />
                                    </EditProvider>
                                )}
                                fullWidth={category=='enum'}
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
    scope: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default AddDialog;

