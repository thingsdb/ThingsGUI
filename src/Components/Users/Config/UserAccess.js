/*eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Password from './Password';
import Remove from './Remove';
import Rename from './Rename';
import {ThingsdbActions} from '../../../Stores';
import {ErrorMsg, getScopes} from '../../Util';
import {UserAccessTAG} from '../../../constants';

const privileges = [
    {
        ky: 'query',
        label: 'QUERY',
    },
    {
        ky: 'event',
        label: 'EVENT',
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

const tag = UserAccessTAG;

const UserAccess = ({user, collections, close}) => {
    const [switches, setSwitches] = React.useState({});

    const getSwitches = (scope, privileges) => {
        let s = {
            full: false,
            query: false,
            event: false,
            grant: false,
            watch: false,
            run: false,
        };

        s.full = privileges.includes('FULL');
        if (s.full) {
            s.query = true;
            s.event = true;
            s.grant = true;
            s.watch = true;
            s.run = true;
        } else {
            s.query = privileges.includes('QUERY');
            s.event = privileges.includes('EVENT');
            s.grant = privileges.includes('GRANT');
            s.watch = privileges.includes('WATCH');
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
            component: <Remove user={user} close={close} />
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
                                                <Grid item xs={2} key={ky} container justify="center" >
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
                                                {privileges.map(({ky, label}) => (
                                                    <Grid item xs={2} key={ky} container justify="center">
                                                        <Checkbox checked={switches[key][ky]} onChange={handleOnChangeSwitch(key)} value={label} color="primary" />
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
            <Grid container item lg={6} md={12} spacing={1} direction="row" justify="center" alignItems="center" >
                {buttons.map(button => (
                    <Grid key={button.name} item>
                        {button.component}
                    </Grid>
                ))}
            </Grid>
        </Grid>

    );
};

UserAccess.defaultProps = {
    close: false,
};

UserAccess.propTypes = {
    user: PropTypes.object.isRequired,
    collections: PropTypes.arrayOf(PropTypes.object).isRequired,
    close: PropTypes.bool,
};

export default UserAccess;