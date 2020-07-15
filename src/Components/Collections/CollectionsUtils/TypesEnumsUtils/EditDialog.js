/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions, ErrorActions} from '../../../../Stores';
import {EditDialogTAG} from '../../../../constants';
import {ErrorMsg, SimpleModal, WarnPopover} from '../../../Util';
import {EditProvider} from '../Context';
import {PropertyCallback, PropertyInitVal, PropertyMethod, PropertyName, PropertyType, PropertyVal, Wpo} from './AddEditProperty';
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
    },
    queryString: '',
};

const EditDialog = ({dataTypes, category, getInfo, headers, item, link, onChangeItem, onClose, open, queries, rows, scope}) => {
    const [state, setState] = React.useState(initState);
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');
    const [key, setKey] = React.useState('');
    const [oldname, setOldname] = React.useState(null);
    const [blob, setBlob] = React.useState({});

    const [anchorEl, setAnchorEl] = React.useState(null);


    React.useEffect(() => {
        setState(initState);
        setAction('');
    },
    [open],
    );

    const handleBlob = (b) => {
        setBlob(b);
    };

    const handleQuery = (p, a) => {
        const act = a||action;
        console.log(act, p)
        setState(prev=>{
            const update = {...prev.property, ...p}
            return({
                property: update,
                queryString: queries[act]?queries[act][category](item.name, update):''
            });
        });
    };

    const handleQueryRen = (p, n=null) => {
        const name = n===null ? oldname : n;
        setState(prev=>{
            return({
                property: {...prev.property, ...p},
                queryString: queries.ren[category](item.name, name, p.propertyName)
            });
        });
    };

    const handleQueryWpo = (p) => {
        setAction('wpo');
        handleQuery(p, 'wpo')
    };

    const handleAdd = (ky) => {
        setAction('add');
        setKey(ky);
    };

    const handleMod = (ky, p) => () => {
        setOldname(p.propertyName);
        switch(ky){
        case 'propertyName':
            setAction('ren');
            handleQueryRen(p, p.propertyName);
            break;
        case 'propertyObject':
            setAction('mod');
            handleQuery(p, 'mod');
            setKey('Fields');
            break;
        case 'definition':
            setAction('mod');
            handleQuery(p, 'mod');
            setKey('Methods');
            break;
        case 'default':
            setAction('def');
            handleQuery(p, 'def');
            break;
        }
    };


    const handleDel = (p) => (e) => {
        setState({...state, property: p, queryString:  queries.del[category](item.name, p)});
        setAnchorEl(e.currentTarget);
        setAction('del');
    };

    const handleCloseDelete = () => {
        setState(initState);
        setAnchorEl(null);
    };

    const handleBack = () => {
        handleCloseError();
        setState(initState);
        setBlob({});
        setOldname(null);
        setAction('');
    };

    const handleClickOk = () => {
        handleCloseError();
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
                    setAction('');
                    setAnchorEl(null);
                    setState(initState);
                    setBlob({});
                }
            );
        } else {
            CollectionActions.rawQuery(
                scope,
                queryString,
                tag,
                (_data) => {
                    getInfo(scope, tag);
                    setAction('');
                    setAnchorEl(null);
                    setState(initState);
                    setBlob({});
                }
            );
        }
    };

    const handleCloseError = () => {
        ErrorActions.removeMsgError(tag);
    };

    const overview = action=='';
    const add = action=='add';
    const mod = action=='mod';
    const def = action=='def';
    const del = action=='del';
    const ren = action=='ren';
    const wpo = action=='wpo';

    const showOverview = overview||del;
    const showSubmitBack = !showOverview;
    const showTextFields = add || mod || ren;
    const showDefault = def;
    const showQuery = Boolean(queryString);

    const showName = add||ren;
    const showType = !ren&&key!='Methods'&&category=='type';
    const showVal = !ren&&category=='enum';
    const showValIni = add&&key=='Fields'&&category=='type';
    const showMethod = (mod||add)&&key=='Methods'&&category=='type';
    const showCallback = mod&&category=='type';
    const showWpo = category=='type';
    const showWpoWarning = wpo;


    const buttons = (row) => (
        <React.Fragment>
            <Button onClick={handleDel(row)} >
                <DeleteIcon color="primary" />
            </Button>
            <WarnPopover anchorEl={anchorEl} onClose={handleCloseDelete} onOk={handleClickOk} description={`Are you sure you want to remove '${property.propertyName?property.propertyName:''}'`} />
        </React.Fragment>
    );

    const badgeButton = (h, row, i) => (
        !(row.default!=null && h.ky=='default') ? (
            <ButtonBase onClick={handleMod(h.ky, row)}>
                <EditIcon color="primary" style={{fontSize: 20}} />
            </ButtonBase>
        ):null
    );

    console.log(item, property)

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
                        <Collapse in={showQuery} timeout="auto">
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
                        <Collapse in={showTextFields} timeout="auto" unmountOnExit>
                            <ListItem>
                                <EditProvider>
                                    <Grid container item xs={12} spacing={1} alignItems="center" >
                                        {showName ? (
                                            <Grid item xs={12}>
                                                <PropertyName cb={ren?handleQueryRen:handleQuery} input={property.propertyName||''} />
                                            </Grid>
                                        ) : null}
                                        {showType? (
                                            <Grid item xs={12}>
                                                <PropertyType cb={handleQuery} dropdownItems={dataTypes} input={property.propertyType||''} />
                                            </Grid>
                                        ) : null}
                                        {showMethod ? (
                                            <Grid item xs={12}>
                                                <PropertyMethod cb={handleQuery} input={property.definition||''} />
                                            </Grid>
                                        ) : null}
                                        {showVal? (
                                            <Grid item xs={12}>
                                                <PropertyVal category={category} cb={handleQuery} onBlob={handleBlob} scope={scope} />
                                            </Grid>
                                        ) : showValIni ? (
                                            <Grid item xs={12}>
                                                <PropertyInitVal category={category} cb={handleQuery} onBlob={handleBlob} scope={scope} />
                                            </Grid>
                                        ) : null}
                                        {showCallback ? (
                                            <Grid item xs={12}>
                                                <PropertyCallback cb={handleQuery} />
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
                                <Wpo cb={handleQueryWpo} input={item.wrap_only} />
                            </ListItem>
                        </Collapse>
                        <Collapse in={showWpoWarning} timeout="auto" unmountOnExit>
                            <ListItem>
                                <Typography variant="body2" >
                                    {`On submit you will ${property.wpo?'enable':'disable'} wrap-only mode, no instances of the type can be created and the type can not be used by other type unless that type is also in wrap-only mode.`}
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

EditDialog.defaultProps = {
    item: {},
    dataTypes: [],
    onChangeItem: ()=>null,
    open: false,
};

EditDialog.propTypes = {
    dataTypes: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string.isRequired,
    getInfo: PropTypes.func.isRequired,
    headers: PropTypes.object.isRequired,
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    queries: PropTypes.object.isRequired,
    rows: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditDialog;
