import PropTypes from 'prop-types';
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

import PasswordUser from './Password';
import RemoveUser from './Remove';
import RenameUser from './Rename';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';
import {ErrorMsg} from '../Util';

const useStyles = makeStyles(theme => ({
    flex: {
        display: 'flex',
    },
    buttons: {
        width: '40%',
    },
    card: {
        width: '60%',
        padding: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
    user: {
        padding: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
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

const tag = '19';

const UserAccess = ({user, collections}) => {
    const classes = useStyles();
    const [switches, setSwitches] = React.useState({});

    console.log('grant');

    const getSwitches = (scope, privileges) => {
        let s = {
            full: false,
            read: false,
            modify: false,
            grant: false,
            watch: false,
            run: false,
        };

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

        return ({[scope]: s});
    };

    // const scopes = [
    //     {name: 'ThingsDB', value: '@thingsdb'},
    //     {name: 'Node', value: '@node'},
    //     ...collections.map((c) => ({name: c.name, value: `@:${c.name}`}))
    // ];

    //TODO CHECK IF SCOPES ARE CORRECT

    React.useEffect(() => {
        let s = {};
        // scopes.map(({_name, value}) => {
        //     s = Object.assign({}, s, getSwitches(value, ''));
        // });
        user.access.map(({scope, privileges}) => {
            s = Object.assign({}, s, getSwitches(scope, privileges));
        });
        setSwitches(s);
    },
    [user, collections.length]
    );


    const handleOnChangeSwitch = (key) => ({target}) => {
        const {value, checked} = target;
        setSwitches(switches => {
            let newswitches = JSON.parse(JSON.stringify(switches));
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
            component: <PasswordUser user={user} />
        },
        {
            name: 'rename',
            component: <RenameUser user={user} />
        },
        {
            name: 'remove',
            component: <RemoveUser user={user} />
        },
    ];


    const switchesKeys = Object.keys(switches);

    return (
        <div className={classes.flex}>
            <Card className={classes.card}>
                <Typography className={classes.title} variant="body1" >
                    {'ACCESS RULES'}
                </Typography>
                <ErrorMsg tag={tag} />
                <Grid
                    className={classes.user}
                    container
                    direction="row"
                    spacing={3}
                >
                    <Grid item >
                        <Grid container spacing={1}>
                            <Grid item container xs={12} spacing={2} >
                                <Grid item xs={3} />
                                <Grid item container xs={9} >
                                    <Grid item container xs={12} >
                                        {privileges.map(({ky, label}) => (
                                            <Grid item xs={2} key={ky} container justify="center" >
                                                <Typography variant="overline" align="center" >
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
                                        <Grid item xs={3} container alignItems="center">
                                            <Typography>
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
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
            <Grid className={classes.buttons} container spacing={1} direction="row" justify="center" alignItems="center" >
                {buttons.map(button => (
                    <Grid key={button.name} item>
                        {button.component}
                    </Grid>
                ))}
            </Grid>
        </div>

    );
};

UserAccess.propTypes = {
    user: PropTypes.object.isRequired,
    collections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserAccess;