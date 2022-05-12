/*eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Password from './Password';
import Remove from './Remove';
import Rename from './Rename';
import {ThingsdbActions} from '../../../Stores';
import {ErrorMsg, getScopes} from '../../Utils';
import {UserAccessTAG} from '../../../Constants/Tags';

const privileges = [
    {
        ky: 'query',
        label: 'QUERY',
        value: 1,
    },
    {
        ky: 'change',
        label: 'CHANGE',
        value: 2,
    },
    {
        ky: 'grant',
        label: 'GRANT',
        value: 4,
    },
    {
        ky: 'join',
        label: 'JOIN',
        value: 8,
    },
    {
        ky: 'run',
        label: 'RUN',
        value: 16,
    },
];

const tag = UserAccessTAG;

const UserAccess = ({user, collections}) => {
    const [switches, setSwitches] = React.useState({});

    const getSwitches = (scope, privileges) => {
        let s = {
            full: false,
            query: false,
            change: false,
            grant: false,
            join: false,
            run: false,
        };

        s.full = privileges.includes('FULL');
        if (s.full) {
            s.query = true;
            s.change = true;
            s.grant = true;
            s.join = true;
            s.run = true;
        } else {
            s.query = privileges.includes('QUERY');
            s.change = privileges.includes('CHANGE');
            s.grant = privileges.includes('GRANT');
            s.join = privileges.includes('JOIN');
            s.run = privileges.includes('RUN');
        }

        return ({[scope]: s});
    };


    React.useEffect(() => {
        let s = {};
        const scopes = getScopes(collections)[0];
        scopes.forEach(({_name, value}) => {
            s = Object.assign({}, s, getSwitches(value, ''));
        });
        user.access.forEach(({scope, privileges}) => {
            s = Object.assign({}, s, getSwitches(scope, privileges));
        });
        setSwitches(s);
    },
    [user, collections]
    );


    const handleOnChangeSwitch = (key) => ({target}) => {
        const {value, checked} = target;
        setSwitches(switches => {
            let newswitches = JSON.parse(JSON.stringify(switches)); //copy
            newswitches[key][value] = checked;
            return newswitches;
        });

        if (checked) {
            ThingsdbActions.grant(
                user.name,
                key,
                value,
                tag,
            );
        } else {
            ThingsdbActions.revoke(
                user.name,
                key,
                value,
                tag,
            );
        }
    };

    const buttons = [
        {
            name: 'password',
            component: <Password user={user} />
        },
        {
            name: 'rename',
            component: <Rename user={user} />
        },
        {
            name: 'remove',
            component: <Remove user={user} />
        },
    ];


    const switchesKeys = Object.keys(switches);

    return (
        <Grid container >
            <Grid item lg={6} md={12} >
                <Card>
                    <CardContent>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body2" >
                                    {'ACCESS RULES'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ErrorMsg tag={tag} />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            spacing={3}
                        >
                            <Grid container item spacing={1}>
                                <Grid item container xs={12} spacing={2} >
                                    <Grid item xs={3} />
                                    <Grid item container xs={9} >
                                        <Grid item container xs={12} >
                                            {privileges.map(({ky, label}) => (
                                                <Grid item xs={2} key={ky} container justifyContent="center" >
                                                    <Typography variant="overline" align="center" component="span" noWrap>
                                                        {label}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {switchesKeys.map((key, i) => (
                                    <Grid key={i} item container xs={12} spacing={2}>
                                        <Grid item xs={3} container alignItems="center">
                                            <Typography component="span" noWrap>
                                                {key}
                                            </Typography>
                                        </Grid>
                                        <Grid item container xs={9} >
                                            <Grid item container xs={12} >
                                                {privileges.map(({ky, value}) => (
                                                    <Grid item xs={2} key={ky} container justifyContent="center">
                                                        <Checkbox checked={switches[key][ky]} onChange={handleOnChangeSwitch(key)} value={value} color="primary" />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            <Grid container item lg={6} md={12} spacing={1} direction="row" justifyContent="center" alignItems="center" >
                {buttons.map(button => (
                    <Grid key={button.name} item>
                        {button.component}
                    </Grid>
                ))}
            </Grid>
        </Grid>

    );
};

UserAccess.propTypes = {
    user: PropTypes.object.isRequired,
    collections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserAccess;