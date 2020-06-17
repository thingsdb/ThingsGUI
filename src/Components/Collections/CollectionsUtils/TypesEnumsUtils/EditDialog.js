/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
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
import {EditDialogTAG} from '../../../../constants';
import {ErrorMsg, SimpleModal, WarnPopover} from '../../../Util';
import {EditProvider} from '../Context';
import AddProperty from './AddProperty';
import Overview from './Overview';

const tag = EditDialogTAG;

const initState = {
    property: {
        default: null,
        propertyName: '',
        propertyObject:null,
        propertyType: '',
        propertyVal: null
    },
    queryString: '',
};

const EditDialog = ({dataTypes, category, getInfo, item, link, onChangeItem, onClose, open, rows, scope}) => {
    const [state, setState] = React.useState(initState);
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');
    const [index, setIndex] = React.useState(null);
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

    const handleQueryAdd = (p) => {
        setState({property: p, queryString: `mod_${category}('${item.name}', 'add', '${p.propertyName}'${category=='type'?`, '${p.propertyType}'`:''}${p.propertyVal?`, ${p.propertyVal}`:''})`});
    };

    const handleQueryMod = (p) => {
        setState({property: p, queryString: `mod_${category}('${item.name}', 'mod', '${p.propertyName}', ${category=='type'?`'${p.propertyType}'`: p.propertyVal})`});
    };

    const handleQueryModRen = (p) => {
        setState({property: p, queryString: `mod_${category}('${item.name}', 'ren', '${rows[index]&&rows[index].propertyName}', '${p.propertyName}')`});
    };

    const handleQueryModDef = (p) => {
        setState({...state, property: p, queryString: `mod_${category}('${item.name}', 'def', '${p.propertyName}')`});
    };

    const handleAdd = () => {
        setAction('add');
    };

    const handleMod = (ky, p, i) => () => {
        setIndex(i);
        switch(ky){
        case 'propertyName':
            setAction('ren');
            handleQueryModRen(p);
            break;
        case 'propertyObject':
            setAction('mod');
            handleQueryMod(p);
            break;
        case 'default':
            setAction('def');
            handleQueryModDef(p);
            break;
        }
    };


    const handleDel = (p) => (e) => {
        setState({...state, property: p, queryString: `mod_${category}('${item.name}', 'del', '${p.propertyName}')`});
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
        setIndex(null);
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
    const edit = action=='mod';
    const def = action=='def';
    const del = action=='del';
    const ren = action=='ren';

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
            <ButtonBase onClick={handleMod(h.ky, row, i)}>
                <EditIcon color="primary" style={{fontSize: 20}} />
            </ButtonBase>
        ):null
    );

    return (
        <SimpleModal
            open={open}
            onClose={onClose}
            onOk={add||edit||ren||def?handleClickOk:null}
            maxWidth="md"
            actionButtons={add||edit||ren||def ? (
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
                        <Collapse in={add || edit || ren} timeout="auto" unmountOnExit>
                            <ListItem>
                                <EditProvider>
                                    <AddProperty
                                        category={category}
                                        cb={add?handleQueryAdd:ren?handleQueryModRen:handleQueryMod}
                                        dropdownItems={dataTypes}
                                        hasInitVal={add&&category=='type'}
                                        hasPropName={add||ren}
                                        hasType={!ren&&category=='type'}
                                        hasVal={!ren&&category=='enum'}
                                        onBlob={handleBlob}
                                        input={property}
                                        scope={scope}
                                    />
                                </EditProvider>
                            </ListItem>
                        </Collapse>
                        <Collapse in={def} timeout="auto" unmountOnExit>
                            <ListItem>
                                <Typography variant="body1" >
                                    {`Set ${property.propertyName} as default?`}
                                </Typography>
                            </ListItem>
                        </Collapse>
                        <Collapse in={overview||del} timeout="auto" unmountOnExit>
                            <Overview
                                category={category}
                                badgeButton={badgeButton}
                                buttons={buttons}
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
    item: PropTypes.object,
    link: PropTypes.string.isRequired,
    onChangeItem: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.string.isRequired,
};

export default EditDialog;
