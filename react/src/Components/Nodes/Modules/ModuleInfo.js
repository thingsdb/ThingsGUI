import makeStyles from '@mui/styles/makeStyles';
import {withVlow} from 'vlow';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';
import Link from '@mui/material/Link';
import moment from 'moment';
import MoreIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from 'prop-types';
import React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {ModuleInfoTAG} from '../../../Constants/Tags';
import {NodesActions, NodesStore} from '../../../Stores';
import {SimpleModal, ErrorMsg, LocalMsg} from '../../Util';
import {THINGS_DOC_RENAME_MODULE, THINGS_DOC_SET_MODULE_CONFIG, THINGS_DOC_SET_MODULE_SCOPE} from '../../../Constants/Links';
import {DATE_TIME_SEC_STR} from '../../../Constants/DateStrings';

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
        fnView: (t) => moment(t*1000).format(DATE_TIME_SEC_STR),
        canEdit: false
    },
    {
        ky: 'name',
        label: 'Name',
        canEdit: true,
        editMethod: NodesActions.renameModule,
        helperText: THINGS_DOC_RENAME_MODULE,
    },
    {
        ky: 'file',
        label: 'File',
        canEdit: false
    },
    {
        ky: 'scope',
        label: 'Scope',
        fnView: (s) => s ? s : 'All scopes',
        canEdit: true,
        editMethod: NodesActions.setModuleScope,
        helperText: THINGS_DOC_SET_MODULE_SCOPE,
    },
    {
        ky: 'status',
        label: 'Status',
        canEdit: false
    },
    {
        ky: 'conf',
        label: 'Configuration',
        fnView: (c) => {
            if(c){
                const json = JSON.stringify(c);
                let unquoted = json.replace(/"([^"]+)":/g, '$1:');
                return unquoted;
            }
            return 'No configuration';
        },
        fnEdit: (c) => {
            if(c){
                const json = JSON.stringify(c);
                let unquoted = json.replace(/"([^"]+)":/g, '$1:');
                return unquoted;
            }
            return c;
        },
        canEdit: true,
        editMethod: NodesActions.setModuleConf,
        helperText: THINGS_DOC_SET_MODULE_CONFIG,
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
        setEdit({});
        setForm({});
        setMsg('');
    };

    const handleEdit = (h) => () => {
        setEdit({...edit, [h.ky]: true});
        setForm({...form, [h.ky]: _module[h.ky] ? (h.fnEdit ? h.fnEdit(_module[h.ky]) : _module[h.ky]) : ''});
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
            fullWidth={false}
            open={show}
            onClose={handleClickClose}
            maxWidth="lg"
            title="Module info"
            actionButtons={
                <Button color="primary" onClick={handleRestart}>
                    {'Restart'}
                </Button>}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <ErrorMsg tag={tag} />
                    <LocalMsg icon={<InfoIcon sx={{color: 'text.primary'}} />} body={msg} onClose={handleCloseMsg} />
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
                                            fullWidth
                                            id={h.ky}
                                            margin="dense"
                                            maxRows="10"
                                            minRows="1"
                                            multiline
                                            onChange={handleChange(h.ky)}
                                            spellCheck={false}
                                            type="text"
                                            value={form[h.ky]}
                                            variant="standard"
                                            helperText={
                                                <Link target="_blank" href={h.helperText}>
                                                    {'ThingsDocs'}
                                                </Link>
                                            }
                                        />
                                    </Grid>
                                    <Grid container spacing={2} item xs={2} justifyContent="flex-start" alignContent="center">
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
                                        <Box
                                            component="div"
                                            sx={{
                                                fontFamily: 'Monospace',
                                                fontSize: 'body1.fontSize',
                                                m: 1,
                                            }}
                                        >
                                            {h.fnView ? h.fnView(_module[h.ky]) : _module[h.ky]}
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