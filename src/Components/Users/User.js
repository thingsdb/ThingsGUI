import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';


import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import ServerError from '../Util/ServerError';
import Checkbox from '@material-ui/core/Checkbox';
import {UsersActions} from '../../Stores/UsersStore';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    user: {
        padding: theme.spacing(2),
    },
    divider: {
        padding: theme.spacing(0.1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        backgroundColor: theme.palette.primary.main,
    },
}));

const privileges = [
    {
        ky: 'read',
        label: 'READ',
    },
    {
        ky: 'modify',
        label: 'MODIFY',
    },
    {
        ky: 'grant',
        label: 'GRANT',
    },
    {
        ky: 'watch',
        label: 'WATCH',
    },
    {
        ky: 'call',
        label: 'CALL',
    },

    {
        ky: 'full',
        label: 'FULL',
    },
];

const initialState = {
    switches: {},
    serverError: '',
};

const User = ({user, collections}) => {
    const classes = useStyles();
    const [state, setState] = React.useState(initialState);
    const {switches, serverError} = state;

    const getSwitches = (target, privileges) => {     
        let s = {
            full: false,
            read: false, 
            modify: false,
            grant: false,
            watch: false,
            call: false,
        }

        s.full = privileges.includes('FULL');
        if (!s.full) {
            s.read = privileges.includes('READ'); 
            s.modify = privileges.includes('MODIFY');
            s.grant = privileges.includes('GRANT');
            s.watch = privileges.includes('WATCH'); 
            s.call = privileges.includes('CALL');
        }
         
        return ({[target]: s})
    }

    const targets = [
        {name: 'ThingsDB', value: '.thingsdb'},
        {name: 'Node', value: '.node'},
        ...collections.map((c) => ({name: c.name, value: c.name}))
    ];

    React.useEffect(() => {
            let switches = {};
            targets.map(({name, value}) => {
                switches = Object.assign({}, switches, getSwitches(value, ''));
            });
            user.access.map(({target, privileges}) => {
                switches = Object.assign({}, switches, getSwitches(target, privileges));
            });
            setState({...state, switches:switches});
            console.log('useEffect called');
        },
        [user, collections.length]
    );


    const handleOnChangeSwitch = (key) => ({target}) => {
        const {value, checked} = target;
        switches[key][value]= checked;
        setState({...state, switches: switches});
   
        if (checked) {
            UsersActions.grant(
                user.name, 
                key, 
                value, 
                (err) => {
                    switches[key][value] = !checked;
                    setState({switches: switches, serverError: err})
                }
            );
        } else {
            UsersActions.revoke(
                user.name, 
                key, 
                value, 
                (err) => {
                    switches[key][value] = !checked;
                    setState({switches: switches, serverError: err})
                }
            );
        }
    };

    const handleServerError = (err) => {
        setState({...state, serverError: err});
    }

    const handleCloseError = () => {
        setState({...state, serverError: ''});;
    }

    const openError = Boolean(serverError); 
    const switchesKeys = Object.keys(switches);

    return (
        <div className={classes.root}>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <Grid
                className={classes.user}
                container
                direction="column"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Typography variant="h6" >
                        {'Access rules of: '}
                    </Typography>
                    <Typography variant="h4" color='primary'>
                        {user.name}
                    </Typography>
                    <Divider className={classes.divider} />
                    <Grid container spacing={1}>
                        <Grid item container xs={12} spacing={2} >
                            <Grid item xs={3} />
                            <Grid item container xs={9} >
                                <Grid item container xs={12} >
                                    {privileges.map(({ky, label}) => (
                                        <Grid item xs={2} key={ky} container justify={'center'} >
                                            <Typography variant={'caption'} align={'center'} >
                                                {label}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>   
                            </Grid>
                        </Grid>
                        {switchesKeys.map((key, i) => (
                            <React.Fragment key={i}>
                                <Grid item container xs={12} spacing={2}>
                                    <Grid item xs={3} container alignItems={'center'} >
                                        <Typography>
                                            {key}
                                        </Typography>
                                    </Grid>
                                    <Grid item container xs={9} >
                                        <Grid item container xs={12} >
                                            {privileges.map(({ky, label}) => (
                                                <Grid item xs={2} key={ky} container justify={'center'} >
                                                    <Checkbox checked={switches[key][ky]} onChange={handleOnChangeSwitch(key)} value={label} color="primary"/>
                                                </Grid>
                                            ))}
                                        </Grid>   
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={1} >
                    <Grid item>
                        <PasswordUser user={user} />
                    </Grid>
                    <Grid item>
                        <RenameUser user={user} />
                    </Grid>
                    <Grid item>
                        <RemoveUser user={user} onServerError={handleServerError} />
                    </Grid>
                </Grid>
            </Grid>
        </div>    
    );
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    collections: PropTypes.array.isRequired,
};

export default User;