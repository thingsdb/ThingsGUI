import { makeStyles} from '@material-ui/core/styles';
import {withVlow} from 'vlow';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';
import Link from '@material-ui/core/Link';
import moment from 'moment';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {SimpleModal, ErrorMsg, LocalMsg} from '../../Util';
import {NodesActions, NodesStore} from '../../../Stores';
import {ModuleInfoTAG} from '../../../constants';

const withStores = withVlow([{
    store: NodesStore,
    keys: ['_module']
}]);

const useStyles = makeStyles(theme => ({
    box: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    color: {
        color: theme.palette.text.primary
    }
}));

const header = [
    {
        ky: 'created_at',
        label: 'Created at',
        fn: (t) => moment(t*1000).format('YYYY-MM-DD HH:mm:ss'),
        canEdit: false
    },
    {
        ky: 'name',
        label: 'Name',
        canEdit: true,
        editMethod: NodesActions.renameModule,
        helperText: 'https://docs.thingsdb.net/v0/thingsdb-api/rename_module/',
    },
    {
        ky: 'file',
        label: 'File',
        canEdit: false
    },
    {
        ky: 'scope',
        label: 'Scope',
        fn: (s) => s ? s : 'All scopes',
        canEdit: true,
        editMethod: NodesActions.setModuleScope,
        helperText: 'https://docs.thingsdb.net/v0/thingsdb-api/set_module_scope/',
    },
    {
        ky: 'status',
        label: 'Status',
        canEdit: false
    },
    {
        ky: 'conf',
        label: 'Configuration',
        fn: (c) => {
            if(c){
                const json = JSON.stringify(c);
                const unquoted = json.replace(/"([^"]+)":/g, '$1:');
                return unquoted;
            }
            return 'No configuration';
        },
        canEdit: true,
        editMethod: NodesActions.setModuleConf,
        helperText: 'https://docs.thingsdb.net/v0/thingsdb-api/set_module_conf/',
    },
    {
        ky: 'restarts',
        label: 'Number of restarts (manual restarts excluded)',
        canEdit: false
    },
    {
        ky: 'tasks',
        label: 'Number of running tasks',
        canEdit: false
    },
];

const tag = ModuleInfoTAG;

const ModuleInfo = ({item, nodeId, _module}) => {
    const classes = useStyles();
    const [show, setShow] = React.useState(false);
    const [edit, setEdit] = React.useState({});
    const [form, setForm] = React.useState({});
    const [msg, setMsg] = React.useState('');

    const handleClickOpen = () => {
        NodesActions.getModule(nodeId, item.name);
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleEdit = (h) => () => {
        setEdit({...edit, [h.ky]: true});
        setForm({...form, [h.ky]: _module[h.ky]||''});
    };

    const handleChange = (ky) => ({target}) => {
        const {value} = target;
        setForm({...form, [ky]: value});
    };

    const handleSave = (h) => () => {
        h.editMethod(nodeId, _module.name, form[h.ky], tag, () => {
            setEdit({...edit, [h.ky]: false});
            setForm({...form, [h.ky]: ''});
        });
    };

    const handleClose = (ky) => () => {
        setEdit({...edit, [ky]: false});
        setForm({...form, [ky]: ''});
    };

    const handleRestart = () => {
        NodesActions.restartModule(nodeId, _module.name, () => {
            setMsg(`${_module.name} has been restarted.`);
        });
    };

    const handleCloseMsg = () => {
        setMsg('');
    };


    return (
        <SimpleModal
            button={
                <Button color="primary" onClick={handleClickOpen}>
                    <MoreIcon color="primary" />
                </Button>
            }
            open={show}
            onClose={handleClickClose}
            maxWidth="md"
            title="Module info"
            actionButtons={
                <Button color="primary" onClick={handleRestart}>
                    {'Restart'}
                </Button>}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                    <LocalMsg icon={<InfoIcon className={classes.color} />} msg={msg} onClose={handleCloseMsg} />
                </Grid>
                {header.map(h => (
                    <Grid key={h.ky} container item xs={12}>
                        <Grid container item xs={4} alignContent="center">
                            <Typography variant="caption">
                                {h.label + ':'}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {h.canEdit && edit[h.ky] ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={8}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id={h.ky}
                                            type="text"
                                            value={form[h.ky]}
                                            spellCheck={false}
                                            onChange={handleChange(h.ky)}
                                            multiline
                                            rows="1"
                                            rowsMax="10"
                                            fullWidth
                                            helperText={
                                                <Link target="_blank" href={h.helperText}>
                                                    {h.helperText}
                                                </Link>
                                            }
                                        />
                                    </Grid>
                                    <Grid container spacing={2} item xs={2} justify="flex-start" alignContent="center">
                                        <ButtonBase onClick={handleSave(h)}>
                                            <SaveIcon color="primary" />
                                        </ButtonBase>
                                        <ButtonBase onClick={handleClose(h.ky)}>
                                            <CloseIcon color="primary" />
                                        </ButtonBase>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography variant="subtitle2">
                                    <Badge
                                        badgeContent={h.canEdit ?
                                            <ButtonBase onClick={handleEdit(h)}>
                                                <EditIcon color="primary" style={{fontSize: 20}} />
                                            </ButtonBase> : null
                                        }
                                    >
                                        <Box className={classes.box} component="div" fontFamily="Monospace" fontSize="body1.fontSize" m={1}>
                                            {h.fn ? h.fn(_module[h.ky]) : _module[h.ky]}
                                        </Box>
                                    </Badge>
                                </Typography>
                            )}

                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </SimpleModal>
    );
};

ModuleInfo.defaultProps = {
    item: {},
};

ModuleInfo.propTypes = {
    item: PropTypes.object,
    nodeId: PropTypes.number.isRequired,

    /* nodes properties */
    _module: NodesStore.types._module.isRequired,
};

export default withStores(ModuleInfo);