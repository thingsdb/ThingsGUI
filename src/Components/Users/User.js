import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import GrantUser from './Grant';
import RevokeUser from './Revoke';
import ServerError from '../Util/ServerError';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {withVlow} from 'vlow';

import {UsersActions} from '../../Stores/UsersStore';
import {CollectionsStore} from '../../Stores/CollectionsStore';

const withStores = withVlow([{
    store: CollectionsStore,
    keys: ['collections']
}]);

const privileges = [
    'READ',
    'MODIFY',
    'GRANT',
    'WATCH',
    'CALL',
    'FULL',
];

const User = ({user, collections}) => {
    const [serverError, setServerError] = React.useState('');
    const [switches, setSwitches] = React.useState({});

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
        setSwitches(switches);
        console.log(switches)
      },
      [user.name]
    );


    const handleOnChangeSwitch = (target) => (e) => {
        
        switches[target][e.target.value]= e.target.checked;
        setSwitches(switches);
   
        if (e.target.checked) {
            UsersActions.grant(
                user.name, 
                target, 
                e.target.value.toUpperCase(), 
                (err) => setState({...state, serverError: err})
            );
        } else {
            UsersActions.revoke(
                user.name, 
                target, 
                e.target.value.toUpperCase(), 
                (err) => onServerError(err)
            );
        }
    };

    const handleServerError = (err) => {
        setServerError(err);
    }

    const handleCloseError = () => {
        setServerError('');
    }

    const openError = Boolean(serverError); 
    const switchesKeys = Object.keys(switches);

    return (
        <React.Fragment>
            <ServerError open={openError} onClose={handleCloseError} error={serverError} />
            <PasswordUser user={user} />
            <RenameUser user={user} />
            <RemoveUser user={user} onServerError={handleServerError} />

            <Typography variant="h6" >
                {'Access'}
            </Typography>
            <Grid container spacing={0}>
                {switchesKeys.map((key) => (
                    <React.Fragment key={key}>
                        <Grid item container xs={12} >
                            <Grid item xs={3}>
                                <Typography>
                                    {key}
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].read} onChange={handleOnChangeSwitch(key)} value="read" color="primary"/>
                                        }
                                        label="READ"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].modify} onChange={handleOnChangeSwitch(key)} value="modify" color="primary"/>
                                        }
                                        label="MODIFY"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].grant} onChange={handleOnChangeSwitch(key)} value="grant" color="primary"/>
                                        }
                                        label="GRANT"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].call} onChange={handleOnChangeSwitch(key)} value="call" color="primary"/>
                                        }
                                        label="CALL"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].watch} onChange={handleOnChangeSwitch(key)} value="watch" color="primary"/>
                                        }
                                        label="WATCH"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch size={'small'} checked={switches[key].full} onChange={handleOnChangeSwitch(key)} value="full" color="primary"/>
                                        }
                                        label="FULL"
                                    />                      
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </React.Fragment>
    );
};

User.propTypes = {
    user: PropTypes.object.isRequired,
    /* collections properties */
    collections: CollectionsStore.types.collections.isRequired,
};

export default withStores(User);