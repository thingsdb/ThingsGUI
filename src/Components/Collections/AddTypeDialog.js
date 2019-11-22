/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions} from '../../Stores/CollectionStore';
import {TypeActions} from '../../Stores/TypeStore';
import {ArrayLayout, AddTypeProperty, ErrorMsg, SimpleModal} from '../Util';


const tag = '23';

const useStyles = makeStyles(() => ({
    listItem: {
        // margin: 0,
        // padding: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },

}));

const AddTypeDialog = ({open, onClose, dataTypes, scope}) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        queryString: '',
        typeName: '',
        error: '',
        properties: [],
    });
    const {queryString, typeName, error, properties} = state;


    React.useEffect(() => {
        setState({
            queryString: '',
            typeName: '',
            error: '',
            properties: [],
        });
    },
    [open],
    );

    React.useEffect(() => {
        setState({...state, queryString: `set_type("${typeName}", {${properties.map((v, i)=>(`${v.propertyName}: '${v.propertyType}'`))}})`});
    },
    [typeName, JSON.stringify(properties)],
    );

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, typeName: value});
    };

    const handleChangeProperty = (index) => (property) => {
        setState(prevState => {
            let update = [...prevState.properties];
            update.splice(index, 1, property);
            return {...prevState, properties: update};
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
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            () => {
                TypeActions.getTypes(scope, tag);
                onClose();
            }
        );
    };


    return (
        <React.Fragment>
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
                                {'Customizing ThingDB type:'}
                            </Typography>
                            <Typography variant="h4" color='primary' component='span'>
                                {'Add new type'}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <ErrorMsg tag={tag} />
                    </Grid>
                    <Grid item xs={12}>
                        <List disablePadding dense>
                            <Collapse in={Boolean(queryString)} timeout="auto">
                                <ListItem className={classes.listItem} >
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
                            <ListItem className={classes.listItem}>
                                <TextField
                                    name="typeName"
                                    label="Name"
                                    type="text"
                                    value={typeName}
                                    spellCheck={false}
                                    onChange={handleChange}
                                    fullWidth
                                    // helperText={error}
                                    // error={Boolean(error)}
                                />
                            </ListItem>
                            <ListItem>
                                <Typography variant="body1" >
                                    {'Add properties:'}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ArrayLayout
                                    child={(i) => (
                                        <AddTypeProperty
                                            cb={handleChangeProperty(i)}
                                            dropdownItems={dataTypes}
                                            input={properties[i]}
                                        />
                                    )}
                                    onRemove={handleRemove}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </SimpleModal>
        </React.Fragment>
    );
};


AddTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    scope: PropTypes.string.isRequired
};

export default AddTypeDialog;
