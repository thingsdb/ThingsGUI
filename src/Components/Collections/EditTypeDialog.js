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
import {ErrorMsg, SimpleModal, TableWithButtons} from '../Util';


const tag = '24';

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

const EditTypeDialog = ({open, onClose, customType, dataTypes, scope}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        queryString: '',
        propertyName: '',
        propertyType: '',
        initialVal: '',
        error: '',
    });
    const {queryString, propertyName, propertyType, initialVal, error} = state;

    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyType', label: 'Type'},
    ];
    const rows = customType.properties?Object.entries(customType.properties).map(([k, v])=>({propertyName: k, propertyType: v})):[];

    React.useEffect(() => {
        setState({
            queryString: '',
            error: '',
            properties: [],
        });
    },
    [open],
    );

    const handleQueryAdd = () => {
        setState({...state, queryString: `mode_type('${customType.name}', 'add', '${propertyName}', '${propertyType}', '${initialVal}')`});
    };

    const handleQueryMod = () => {
        setState({...state, queryString: `mode_type('${customType.name}', 'mod', '${propertyName}', '${propertyType}')`});
    };

    const handleQueryDel = () => {
        setState({...state, queryString: `mode_type('${customType.name}', 'del')`});
    };

    const handleChange = ({target}) => {
        const {name, value} = target;
        setState({...state, [name]: value});
    } ;

    const handleRemove = (index) => {
        // setState(prevState => {
        //     let update = [...prevState.properties];
        //     update.splice(index, 1);
        //     return {...prevState, properties: update};
        // });
    };


    const handleClickOk = () => {
        CollectionActions.rawQuery2(
            scope,
            queryString,
            tag,
            () => {
                TypeActions.getTypes(scope, tag);
                onClose();
            }
        );
    };

    const handleButtons = (backup) => <RemoveBackup nodeId={nodeId} backup={backup} />;


    return (
        <React.Fragment>
            <SimpleModal
                open={open}
                onClose={onClose}
                onOk={handleClickOk}
                maxWidth="sm"
                disableOk={Boolean(error)}
            >
                <Grid container spacing={1}>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={8}>
                            <Typography variant="body1" >
                                {'Customizing ThingDB type:'}
                            </Typography>
                            <Typography variant="h4" color='primary' component='span'>
                                {customType.name||'Add new type'}
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
                            <ListItem>
                                <Typography variant="body1" >
                                    {'Current properties:'}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <TableWithButtons
                                    header={header}
                                    rows={rows}
                                    rowClick={()=>null}
                                    buttons={()=>null}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </SimpleModal>
        </React.Fragment>
    );
};

EditTypeDialog.defaultProps = {
    customType: {},
};

EditTypeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    customType: PropTypes.object,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    scope: PropTypes.string.isRequired
};

export default EditTypeDialog;
