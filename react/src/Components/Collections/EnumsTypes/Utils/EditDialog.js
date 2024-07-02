import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Collapse from '@mui/material/Collapse';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { CollectionActions, ErrorActions } from '../../../../Stores';
import { EditDialogTAG } from '../../../../Constants/Tags';
import { EditName, EditProvider, ErrorMsg, SimpleModal, WarnPopover } from '../../../Utils';
import { PropertyCallback, PropertyInitVal, PropertyMethod, PropertyName, PropertyRelation, PropertyType, PropertyVal, Wpo } from './AddEditProperty';
import Overview from './Overview';

const tag = EditDialogTAG;

const initState = {
    property: {
        default: null,
        definition: '',
        propertyName: '',
        propertyObject:null,
        propertyType: '',
        propertyVal: null,
        callback: '',
        wpo: false,
        relation: {
            property: '',
            propertyToo: ''
        },
        propertyRelation: null,
    },
    queryObj: {},
};

const initShow = {
    name: false,
    type: false,
    val: false,
    valInit: false,
    method: false,
    callback: false,
};

const EditDialog = ({
    dataTypes = [],
    category,
    getInfo,
    headers,
    item = {},
    link,
    onChangeItem = () => null,
    onClose,
    open = false,
    onRename,
    queries,
    rows,
    scope,
}) => {
    const [state, setState] = React.useState(initState);
    const {queryObj, property} = state;
    const [action, setAction] = React.useState('');
    const [oldname, setOldname] = React.useState(null);
    const [show, setShow] = React.useState(initShow);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [warnDescription, setWarnDescription] = React.useState('');
    const [isType, setIsType] = React.useState(category === 'type');

    const overview = action=='';
    const add = action=='addField'||action=='addMethod';
    const mod = action=='mod';
    const met = action=='met';
    const def = action=='def';
    const del = action=='del';
    const ren = action=='ren';
    const rel = action=='rel';
    const wpo = action=='wpo';

    const showOverview = overview||del;
    const showSubmitBack = !showOverview;
    const showTextFields = add || mod || met || ren;
    const showDefault = def;
    const showWpo = isType&&overview;
    const showWpoWarning = wpo;
    const showRelation = rel;
    const showQuery = Boolean(queryObj?.queryString);

    React.useEffect(() => {
        setIsType(category === 'type');
    }, [category]);

    React.useEffect(() => {
        setAction('');
    }, [open]);

    const handleQuery = (p, a) => {
        const act = a || action;
        setState(prev=>{
            const update = {...prev.property, ...p};
            return({
                property: update,
                queryObj: queries[act] ? queries[act][category](item.name, update) : ''
            });
        });
    };

    const handleQueryRen = (p, n=null) => {
        const name = n===null ? oldname : n;
        setState(prev=>{
            const update = {oldname: name, newname: p.propertyName};
            return({
                property: {...prev.property, ...p},
                queryObj: queries.ren[category](item.name, update)
            });
        });
    };

    const handleQueryWpo = (p) => {
        setAction('wpo');
        handleQuery(p, 'wpo');
    };

    const handleDelRel = (p) => (e) => {
        handleQuery(p, 'delRel');
        setAnchorEl(e.currentTarget);
        setWarnDescription(`Are you sure you want to remove the relation of '${p.propertyName?p.propertyName:''}'`);
        setAction('del');
    };

    const handleAdd = (kys) => {
        kys.forEach((i) => {
            switch(i.ky){
            case 'propertyObject':
                setShow({...initShow,
                    name: true,
                    type: isType,
                    valInit: isType,
                    val: !isType,
                });
                setAction('addField');
                setState(initState);
                break;
            case 'definition':
                setShow({...initShow,
                    name: true,
                    method: true,
                });
                setAction('addMethod');
                setState(initState);
                break;
            }
        });
    };

    const handleMod = (ky, p) => () => {
        setOldname(p.propertyName);
        switch(ky){
        case 'propertyName':
            setAction('ren');
            handleQueryRen(p, p.propertyName);
            setShow({...initShow, name: true});
            break;
        case 'propertyObject':
            setAction('mod');
            handleQuery(p, 'mod');
            setShow({...initShow,
                type: isType,
                val: !isType,
                callback: isType,
            });
            break;
        case 'definition':
            setAction('met');
            handleQuery(p, 'met');
            setShow({...initShow,
                method: true,
            });
            break;
        case 'default':
            setAction('def');
            handleQuery(p, 'def');
            break;
        case 'propertyRelation':
            setAction('rel');
            handleQuery(p, 'rel');
            break;
        }
    };


    const handleDel = (p) => (e) => {
        handleQuery(p, 'del');
        setAnchorEl(e.currentTarget);
        setWarnDescription(`Are you sure you want to remove '${p.propertyName?p.propertyName:''}'`);
        setAction('del');
    };

    const handleCloseDelete = () => {
        setState(initState);
        setAnchorEl(null);
    };

    const handleBack = () => {
        handleCloseError();
        setAction('');
        setAnchorEl(null);
        setOldname(null);
        setState(initState);
    };

    const handleClickOk = () => {
        handleCloseError();
        CollectionActions.query(
            scope,
            queryObj?.query,
            tag,
            () => {
                getInfo(scope, tag);
                handleBack();
            },
            null,
            queryObj?.blob,
            queryObj?.jsonArgs
        );
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const buttons = (row) => (
        <React.Fragment>
            <Button color="primary" onClick={handleDel(row)} >
                <DeleteIcon color="primary" />
            </Button>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description={warnDescription} />
        </React.Fragment>
    );

    const badgeButton = (h, row) => (
        <React.Fragment>
            {!(row.default !== null && h.ky === 'default') ? (
                <ButtonBase onClick={handleMod(h.ky, row)}>
                    <EditIcon color="primary" style={{fontSize: 20}} />
                </ButtonBase>
            ):null}
            {(h.ky === 'propertyRelation' && item.relations[row.propertyName]) ? (
                <ButtonBase onClick={handleDelRel(row)}>
                    <DeleteIcon color="primary" style={{fontSize: 20}} />
                </ButtonBase>
            ) : null}
        </React.Fragment>
    );

    const handleRename = (oldName, newName) => {
        onRename(oldName, newName, scope, tag, onClose);
    };

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={showSubmitBack?handleClickOk:null}
            maxWidth="md"
            actionButtons={showSubmitBack ? (
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
                        <EditName name={item.name||`Add new ${category}`} fn={handleRename} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                </Grid>
                <Grid item xs={12}>
                    <List disablePadding dense>
                        <Collapse in={showQuery} timeout="auto">
                            <ListItem>
                                <TextField
                                    fullWidth
                                    label="Query"
                                    multiline
                                    name="queryString"
                                    type="text"
                                    value={queryObj?.queryString}
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
                        <Collapse in={showTextFields} timeout="auto" unmountOnExit>
                            <ListItem>
                                <EditProvider>
                                    <Grid container item xs={12} spacing={1} alignItems="center" >
                                        {show.name ? (
                                            <Grid item xs={12}>
                                                <PropertyName onChange={ren?handleQueryRen:handleQuery} input={property.propertyName||''} />
                                            </Grid>
                                        ) : null}
                                        {show.type? (
                                            <Grid item xs={12}>
                                                <PropertyType onChange={handleQuery} dropdownItems={dataTypes} input={property.propertyType||''} />
                                            </Grid>
                                        ) : null}
                                        {show.method ? (
                                            <Grid item xs={12}>
                                                <PropertyMethod onChange={handleQuery} input={property.definition||''} />
                                            </Grid>
                                        ) : null}
                                        {show.val? (
                                            <Grid item xs={12}>
                                                <PropertyVal category={category} onChange={handleQuery} scope={scope} />
                                            </Grid>
                                        ) : show.valInit ? (
                                            <Grid item xs={12}>
                                                <PropertyInitVal category={category} onChange={handleQuery} scope={scope} />
                                            </Grid>
                                        ) : null}
                                        {show.callback ? (
                                            <Grid item xs={12}>
                                                <PropertyCallback onChange={handleQuery} />
                                            </Grid>
                                        ) : null}
                                    </Grid>
                                </EditProvider>
                            </ListItem>
                        </Collapse>
                        <Collapse in={showDefault} timeout="auto" unmountOnExit>
                            <ListItem>
                                <Typography variant="body1" >
                                    {`Set ${property.propertyName} as default?`}
                                </Typography>
                            </ListItem>
                        </Collapse>
                        <Collapse in={showWpo||showWpoWarning} timeout="auto" unmountOnExit>
                            <ListItem>
                                <ListItemText
                                    primary="Wrap-only mode:"
                                />
                            </ListItem>
                            <ListItem>
                                <Wpo onChange={handleQueryWpo} input={item.wrap_only} />
                            </ListItem>
                        </Collapse>
                        <Collapse in={showRelation} timeout="auto" unmountOnExit>
                            <ListItem>
                                <PropertyRelation onChange={handleQuery} input={property.relation} dropdownItems={(item.fields || []).map(f => f[0])} />
                            </ListItem>
                        </Collapse>
                        <Collapse in={showWpoWarning} timeout="auto" unmountOnExit>
                            <ListItem>
                                <Typography variant="body2" >
                                    {`On submit you will ${property.wpo?'enable':'disable'} wrap-only mode, no instances of "${item.name}" can be created and this type can only be used by types that are also in wrap-only mode.`}
                                </Typography>
                            </ListItem>
                        </Collapse>
                        <Collapse in={showOverview} timeout="auto">
                            <Overview
                                badgeButton={badgeButton}
                                buttons={buttons}
                                headers={headers}
                                item={item}
                                link={link}
                                onAdd={handleAdd}
                                onChangeItem={onChangeItem}
                                rows={rows}
                                scope={scope}
                            />
                        </Collapse>
                    </List>
                </Grid>
            </Grid>
        </SimpleModal>
    );
};

EditDialog.propTypes = {
    category: PropTypes.string.isRequired,
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    getInfo: PropTypes.func.isRequired,
    headers: PropTypes.object.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onRename: PropTypes.func.isRequired,
    open: PropTypes.bool,
    queries: PropTypes.object.isRequired,
    rows: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditDialog;
