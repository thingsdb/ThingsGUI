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

const UserAccess = ({user, collections}: Props) => {
    const [switches, setSwitches] = React.useState<any>({});

    const getSwitches = (scope, privileges) => {
        let s = {
            full: false,
            user: false,
            query: false,
            change: false,
            grant: false,
            join: false,
            run: false,
        };

        s.full = privileges.includes('FULL');
        s.user = privileges.includes('USER');
        if (s.full) {
            s.query = true;
            s.change = true;
            s.grant = true;
            s.join = true;
            s.run = true;
        } else if (s.user) {
            s.query = true;
            s.change = true;
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
                Number(value),
                tag,
            );
        } else {
            ThingsdbActions.revoke(
                user.name,
                key,
                Number(value),
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
            <Grid size={{md: 12, lg: 6}}>
                <Card>
                    <CardContent>
                        <Grid container size={12} spacing={2}>
                            <Grid size={12}>
                                <Typography variant="body2" >
                                    {'ACCESS RULES'}
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <ErrorMsg tag={tag} />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            spacing={3}
                        >
                            <Grid container spacing={1}>
                                <Grid container size={12} spacing={2} >
                                    <Grid size={3} />
                                    <Grid container size={9} >
                                        <Grid container size={12} >
                                            {privileges.map(({ky, label}) => (
                                                <Grid size={2} key={ky} container justifyContent="center" >
                                                    <Typography variant="overline" align="center" component="span" noWrap>
                                                        {label}
                                                    </Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {switchesKeys.map((key, i) => (
                                    <Grid key={i} container size={12} spacing={2}>
                                        <Grid size={3} container alignItems="center">
                                            <Typography component="span" noWrap>
                                                {key}
                                            </Typography>
                                        </Grid>
                                        <Grid container size={9} >
                                            <Grid container size={12} >
                                                {privileges.map(({ky, value}) => (
                                                    <Grid size={2} key={ky} container justifyContent="center">
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
            <Grid container size={{md: 12, lg: 6}} spacing={1} direction="row" justifyContent="center" alignItems="center" >
                {buttons.map(button => (
                    <Grid key={button.name}>
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

interface Props {
    user: IUser;
    collections: ICollection[];
}