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
import {AddList, ErrorMsg, SimpleModal} from '../Util';


const tag = '23';

const useStyles = makeStyles(() => ({
    listItem: {
        margin: 0,
        padding: 0,
    },
}));

const TypesDialog = ({open, onClose, customType, customTypes, collection}) => {
    const classes = useStyles();
    const dataTypes = [
        'str',
        'utf8',
        'raw',
        'bytes',
        'int',
        'uint',
        'thing',
        '[]',
        '{}',
        'any',
        'str?',
        'utf8?',
        'raw?',
        'bytes?',
        'int?',
        'uint?',
        'thing?',
        '[]?',
        ...Object.keys(customTypes)
    ];

    const [state, setState] = React.useState({
        queryString: '',
        typeName: '',
        error: '',
        properties: [],
    });

    const {queryString, typeName, error, properties} = state;

    React.useEffect(() => {
        setState({...state, queryString: `set_type(new_type("${typeName}"), {${properties.map((v, _i)=>(`${v.value}: '${v.dropdownItem}'`))}})`});
    },
    [typeName, properties.length],
    );

    const handleClickOk = () => {
        CollectionActions.rawQuery2(
            `@collection:${collection.name}`,
            queryString,
            tag,
            () => {
                TypeActions.getTypes(`@collection:${collection.name}`, tag);
                onClose();
            }
        );
    };

    const handleList = (l) => {
        setState({...state, properties: l});
    };

    const handleChange = ({target}) => {
        const {value} = target;
        setState({...state, typeName: value});
    };

    return (
        <React.Fragment>
            {open ? (
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
                                    {'Detail view of type:'}
                                </Typography>
                                <Typography variant="h4" color='primary' component='span'>
                                    {customType||''}
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
                                            margin="dense"
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
                                        margin="dense"
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
                                    <AddList cb={handleList} dropdownItems={dataTypes} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </SimpleModal>
            ) : null}
        </React.Fragment>
    );
};

TypesDialog.defaultProps = {
    customType: {},
};

TypesDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    customType: PropTypes.object,
    customTypes: PropTypes.object.isRequired,
    collection: PropTypes.object.isRequired
};

export default TypesDialog;
