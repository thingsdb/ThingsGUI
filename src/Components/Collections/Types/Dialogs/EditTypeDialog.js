/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ErrorActions, TypeActions} from '../../../../Stores';
import {EditTypeDialogTAG} from '../../../../constants';
import {ErrorMsg, SimpleModal, WarnPopover} from '../../../Util';
import AddTypeProperty from './AddTypeProperty';
import OverviewTypes from './OverviewTypes';

const tag = EditTypeDialogTAG;

const EditTypeDialog = ({open, onClose, customType, customTypes, dataTypes, scope, onChangeType}) => {
    const [state, setState] = React.useState({
        queryString: '',
        property: {propertyName: '', propertyType: '', propertyTypeObject:null, propertyVal: ''},
    });
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);


    React.useEffect(() => {
        setState({
            queryString: '',
            property: {propertyName: '', propertyType: '', propertyTypeObject:null, propertyVal: ''},
        });
        setAction('');
    },
    [open],
    );

    const handleQueryAdd = (p) => {
        const q = p.propertyType == 'str'||p.propertyType == 'utf8'||p.propertyType == 'raw' ?
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
            (_data) => {
                TypeActions.getTypes(scope, tag);
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
            <Button onClick={handleMod(row)} >
                <EditIcon color="primary" />
            </Button>
            <Button onClick={handleDel(row)} >
                <DeleteIcon color="primary" />
            </Button>
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
                            <OverviewTypes buttons={buttons} customType={customType} customTypes={customTypes} onAdd={handleAdd} onChangeType={onChangeType} />
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
    onChangeType: PropTypes.func.isRequired,
    customType: PropTypes.object,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditTypeDialog;
