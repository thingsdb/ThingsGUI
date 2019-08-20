import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import WarningIcon from '@material-ui/icons/Warning';
import { amber } from '@material-ui/core/colors';
import { makeStyles} from '@material-ui/core/styles';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import Tokens from './Tokens';
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
    icon: {
        color: amber[700],
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
        ky: 'run',
        label: 'RUN',
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
            run: false,
        }

        s.full = privileges.includes('FULL');
        if (s.full) {
            s.read = true; 
            s.modify = true;
            s.grant = true;
            s.watch = true; 
            s.run = true;
        } else {
            s.read = privileges.includes('READ'); 
            s.modify = privileges.includes('MODIFY');
            s.grant = privileges.includes('GRANT');
            s.watch = privileges.includes('WATCH'); 
            s.run = privileges.includes('RUN');
        }
         
        return ({[target]: s})
    }

    const targets = [
        {name: 'ThingsDB', value: '.thingsdb'},
        {name: 'Node', value: '.node'},
        ...collections.map((c) => ({name: c.name, value: c.name}))
    ];

    React.useEffect(() => {
            let s = {};
            targets.map(({name, value}) => {
                s = Object.assign({}, s, getSwitches(value, ''));
            });
            user.access.map(({target, privileges}) => {
                s = Object.assign({}, s, getSwitches(target, privileges));
            });
            setState({serverError: '', switches:s});
        },
        [user, collections.length]
    );


    const handleOnChangeSwitch = (key) => ({target}) => {
        const {value, checked} = target;
        setState((prevState => {
            let newswitches = JSON.parse(JSON.stringify(prevState.switches));
            newswitches[key][value] = checked;
            return {...state, switches: newswitches};
        }));

        if (checked) {
            UsersActions.grant(
                user.name, 
                key, 
                value,
                (err) => {
                    setState((prevState => {
                        let newswitches = JSON.parse(JSON.stringify(prevState.switches));
                        newswitches[key][value] = checked;
                        return {serverError: err.log, switches: newswitches};
                    }));
                } 
            );
        } else {
            UsersActions.revoke(
                user.name, 
                key, 
                value, 
                (err) => {
                    setState((prevState => {
                        let newswitches = JSON.parse(JSON.stringify(prevState.switches));
                        newswitches[key][value] = checked;
                        return {serverError: err.log, switches: newswitches};
                    }));
                } 
            );
        }
    };

    const handleCloseError = () => {
        setState({...state, serverError: ''});;
    }

    const switchesKeys = Object.keys(switches);

    return (
        <div className={classes.root}>
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
                    <Collapse in={Boolean(serverError)} timeout="auto" unmountOnExit>
                        <Typography variant={'caption'} color={'error'} >
                            {serverError}
                        </Typography>
                    </Collapse>
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
                                                    <Checkbox disabled={Boolean(serverError)} checked={switches[key][ky]} onChange={handleOnChangeSwitch(key)} value={label} color="primary"/>
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
                        <RemoveUser user={user} />
                    </Grid>
                    <Grid item>
                        <Tokens user={user} />
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