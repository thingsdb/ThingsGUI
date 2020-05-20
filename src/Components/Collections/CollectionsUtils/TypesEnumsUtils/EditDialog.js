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

import {CollectionActions, ErrorActions} from '../../../../Stores';
import {EditTypeDialogTAG} from '../../../../constants';
import {ErrorMsg, SimpleModal, WarnPopover} from '../../../Util';
import AddProperty from './AddProperty';
import Overview from './Overview';

const tag = EditTypeDialogTAG;

const EditDialog = ({dataTypes, category, getInfo, item, link, onChangeItem, onClose, open, rows, scope}) => {
    const [state, setState] = React.useState({
        queryString: '',
        property: {propertyName: '', propertyType: '', propertyObject:null, propertyVal: ''},
    });
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);


    React.useEffect(() => {
        setState({
            queryString: '',
            property: {propertyName: '', propertyType: '', propertyObject:null, propertyVal: ''},
        });
        setAction('');
    },
    [open],
    );

    const handleQueryAdd = (p) => {
        setState({...state, property: p, queryString: `mod_${category}('${item.name}', 'add', '${p.propertyName}', ${category=='type'?`'${p.propertyType}',`:''} ${/^[0-9]*$/gm.test(p.propertyVal)?`${p.propertyVal}`:`'${p.propertyVal}'`})`});
    };

    const handleQueryMod = (p) => {
        setState({property: p, queryString: `mod_${category}('${item.name}', 'mod', '${p.propertyName}', ${category=='type'?`'${p.propertyType}'`:`${/^[0-9]*$/gm.test(p.propertyVal)?`${p.propertyVal}`:`'${p.propertyVal}'`}`})`});
    };

    const handleAdd = () => {
        setAction('add');
    };

    const handleMod = (p) => () => {
        handleQueryMod(p);
        setAction('mod');
    };

    const handleDel = (p) => (e) => {
        setState({property: p, queryString: `mod_${category}('${item.name}', 'del', '${p.propertyName}')`});
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
                getInfo(scope, tag);
                setAction('');
                setAnchorEl(null);
                setState({property: {propertyName: '', propertyType: '', propertyObject:null, propertyVal: ''}, queryString: ''});
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
                            {`Customizing ThingDB ${category}:`}
                        </Typography>
                        <Typography variant="h4" color='primary' component='span'>
                            {item.name||`Add new ${category}`}
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
                                <AddProperty cb={add?handleQueryAdd:handleQueryMod} dropdownItems={dataTypes} input={property} hasType={category=='type'} hasPropName={!edit} hasInitVal={add||category=='enum'} />
                            </ListItem>
                        </Collapse>
                        <Collapse in={overview||del} timeout="auto" unmountOnExit>
                            <Overview category={category} buttons={buttons} item={item} link={link} onAdd={handleAdd} onChangeItem={onChangeItem} rows={rows} scope={scope} />
                        </Collapse>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

EditDialog.defaultProps = {
    item: {},
    dataTypes: [],
    onChangeItem: ()=>null,
};

EditDialog.propTypes = {
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    getInfo: PropTypes.func.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditDialog;
