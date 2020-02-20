/* eslint-disable react/no-multi-comp */
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import AddTypeProperty from './AddTypeProperty';
import {CollectionActions, ErrorActions, TypeActions} from '../../../Stores';
import {ErrorMsg, SimpleModal, TableWithButtons, WarnPopover} from '../../Util';


const tag = '11';

const EditTypeDialog = ({open, onClose, customType, dataTypes, scope, cb}) => {
    const [state, setState] = React.useState({
        queryString: '',
        property: {propertyName: '', propertyType: '', propertyVal: ''},
    });
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);


    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyType', label: 'Type'},
    ];
    const rows = customType.fields? customType.fields.map(c=>({propertyName: c[0], propertyType: c[1], propertyVal: ''})):[];

    React.useEffect(() => {
        setState({
            queryString: '',
            property: {propertyName: '', propertyType: '', propertyVal: ''},
        });
        setAction('');
    },
    [open],
    );

    const handleQueryAdd = (p) => {
        const q = p.propertyType == 'str'||p.propertyType == 'utf8'||p.propertyType == 'raw'||p.propertyType == 'bytes' ?
            `mod_type('${customType.name}', 'add', '${p.propertyName}', '${p.propertyType}', '${p.propertyVal}')`
            : `mod_type('${customType.name}', 'add', '${p.propertyName}', '${p.propertyType}', ${p.propertyVal})`;
        setState({...state, property: p, queryString: q});
    };

    const handleQueryMod = (p) => {
        setState({...state, property: p, queryString: `mod_type('${customType.name}', 'mod', '${property.propertyName}', '${p.propertyType}')`});
    };

    const handleAdd = () => {
        setAction('add');
    };

    const handleMod = (i) => () => {
        setState({property: i, queryString: `mod_type('${customType.name}', 'mod', '${i.propertyName}', '${i.propertyType}')`});
        setAction('mod');
    };

    const handleDel = (i) => (e) => {
        setState({property: i, queryString: `mod_type('${customType.name}', 'del', '${i.propertyName}')`});
        setAnchorEl(e.currentTarget);
        setAction('del');
    };

    const handleCloseDelete = () => {
        setState({property: {propertyName: '', propertyType: '', propertyVal: ''}, queryString: ''});
        setAnchorEl(null);
    };

    const handleBack = () => {
        handleCloseError();
        setState({property: {propertyName: '', propertyType: '', propertyVal: ''}, queryString: ''});
        setAction('');
    };

    const handleClickOk = () => {
        handleCloseError();
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            () => {
                TypeActions.getTypes(scope, tag, cb);
                setAction('');
                setAnchorEl(null);
                setState({property: {propertyName: '', propertyType: '', propertyVal: ''}, queryString: ''});
            }
        );
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const overview = action=='';
    const add = action=='add';
    const edit = action=='mod';
    const del = action=='del';


    const buttons = (row) => (
        <React.Fragment>
            <ButtonBase onClick={handleMod(row)} >
                <EditIcon color="primary" />
            </ButtonBase>
            <ButtonBase onClick={handleDel(row)} >
                <DeleteIcon color="primary" />
            </ButtonBase>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description={`Are you sure you want to remove '${property.propertyName?property.propertyName:''}'`} />
        </React.Fragment>
    );

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={add||edit?handleClickOk:null}
            maxWidth="sm"
            actionButtons={add||edit ? (
                <Button onClick={handleBack} color="primary">
                    {'Back'}
                </Button>
            ):null}
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
                        <Collapse in={add || edit} timeout="auto" unmountOnExit>
                            <ListItem>
                                <AddTypeProperty cb={add?handleQueryAdd:handleQueryMod} dropdownItems={dataTypes} input={property} hasPropName={!edit} hasInitVal={add} />
                            </ListItem>
                        </Collapse>
                        <Collapse in={overview||del} timeout="auto" unmountOnExit>
                            <ListItem>
                                <ListItemText
                                    primary="Current properties:"
                                    secondary={
                                        <Link href="https://docs.thingsdb.net/v0/data-types/type/">
                                            {'https://docs.thingsdb.net/v0/data-types/type/'}
                                        </Link>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <TableWithButtons
                                    header={header}
                                    rows={rows}
                                    rowClick={()=>null}
                                    buttons={buttons}
                                />
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={1}>
                                        <ButtonBase onClick={handleAdd} >
                                            <AddIcon color="primary" />
                                        </ButtonBase>
                                    </Grid>
                                    <Grid container item xs={11} justify="flex-end">
                                        <Box fontSize={10} fontStyle="italic" m={1}>
                                            {`Created on: ${moment(customType.created_at*1000).format('YYYY-MM-DD HH:mm:ss')}, last modified on: ${moment(customType.modified_at*1000).format('YYYY-MM-DD HH:mm:ss')}`}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </Collapse>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
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
    scope: PropTypes.string.isRequired,
    cb: PropTypes.func.isRequired,
};

export default EditTypeDialog;
