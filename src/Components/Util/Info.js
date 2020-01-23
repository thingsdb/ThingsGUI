import { makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
// import m from 'moment-locales-webpack-plugin'
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

import {duration} from '../Util';

const useStyles = makeStyles(theme => ({
    grid: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const Info = ({header, content}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={12} className={classes.grid}>
                        <Typography variant="subtitle2">
                            {h.title + ':'}
                        </Typography>
                        <Divider />
                    </Grid>
                    {h.labels.map((l) => (
                        <React.Fragment key={l.ky}>
                            <Grid container item xs={12}>
                                <Grid item xs={6}>
                                    <Typography variant="caption">
                                        {l.label + ':'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">
                                        {l.ky=='uptime' ? moment.duration(content[l.ky], 'second').humanize()
                                            : l.ky=='created_at' ? moment(content[l.ky]*1000).format('YYYY-MM-DD HH:mm:ss')
                                                : content[l.ky]
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
        </Grid>
    );
};

Info.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    content: PropTypes.object.isRequired
};

export default Info;