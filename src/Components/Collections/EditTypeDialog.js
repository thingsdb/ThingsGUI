/* eslint-disable react/no-multi-comp */
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
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
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {CollectionActions} from '../../Stores/CollectionStore';
import {TypeActions} from '../../Stores/TypeStore';
import {AddTypeProperty, ErrorMsg, SimpleModal, TableWithButtons} from '../Util';


const tag = '24';

const useStyles = makeStyles(theme => ({
    listItem: {
        // margin: 0,
        // padding: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    popover: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.primary.warning,
    },

}));

const EditTypeDialog = ({open, onClose, customType, dataTypes, scope}) => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        queryString: '',
        property: {},
    });
    const {queryString, property} = state;
    const [action, setAction] = React.useState('');

    const [anchorEl, setAnchorEl] = React.useState(null);

    const header = [
        {ky: 'propertyName', label: 'Name'},
        {ky: 'propertyType', label: 'Type'},
    ];
    const rows = customType.properties?Object.entries(customType.properties).map(([k, v])=>({propertyName: k, propertyType: v})):[];

    React.useEffect(() => {
        setState({
            queryString: '',
            property: {},
        });
        setAction('');
    },
    [open],
    );

    const handleQueryAdd = (p) => {
        setState({...state, queryString: `mod_type('${customType.name}', 'add', '${p.propertyName}', '${p.propertyType}', '${p.propertyVal}')`});
    };

    const handleQueryMod = (p) => {
        setState({...state, queryString: `mod_type('${customType.name}', 'mod', '${property.propertyName}', '${p.propertyType}')`});
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
        setState({property: {}, queryString: ''});
        setAnchorEl(null);
    };

    const handleBack = () => {
        setState({property: {}, queryString: ''});
        setAction('');
    };

    const handleClickOk = () => {
        CollectionActions.rawQuery(
            scope,
            queryString,
            tag,
            () => {
                TypeActions.getTypes(scope, tag);
                setAction('');
                setAnchorEl(null);
                setState({property: {}, queryString: ''});
            }
        );
    };
    const overview = action=='';
    const add = action=='add';
    const edit = action=='mod';
    const del = action=='del';

    const handleClosePopOver = () => {
        setAnchorEl(null);
    };

    const openPopOver = Boolean(anchorEl);

    const buttons = (row) => (
        <React.Fragment>
            <ButtonBase onClick={handleMod(row)} >
                <EditIcon color="primary" />
            </ButtonBase>
            <ButtonBase onClick={handleDel(row)} >
                <DeleteIcon color="primary" />
            </ButtonBase>
            <Popover
                classes={{paper: classes.popover}}
                open={openPopOver}
                anchorEl={anchorEl}
                onClose={handleClosePopOver}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                <Typography>{`Are you sure you want to remove '${property.propertyName}'`}</Typography>
                <Button onClick={handleCloseDelete} color="primary">
                    {'Cancel'}
                </Button>
                <Button onClick={handleClickOk} color="primary">
                    {'Ok'}
                </Button>
            </Popover>
        </React.Fragment>
    );

    return (
        <React.Fragment>
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
                            <Collapse in={add || edit} timeout="auto" unmountOnExit>
                                <ListItem>
                                    <AddTypeProperty cb={add?handleQueryAdd:handleQueryMod} dropdownItems={dataTypes} input={edit?property: {}} hasPropName={!edit} hasInitVal={add} />
                                </ListItem>
                            </Collapse>
                            <Collapse in={overview||del} timeout="auto" unmountOnExit>
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
                                        buttons={buttons}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ButtonBase onClick={handleAdd} >
                                        <AddIcon color="primary" />
                                    </ButtonBase>
                                </ListItem>
                            </Collapse>
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
