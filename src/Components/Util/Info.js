import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

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
                        <Typography variant="subtitle2" color="primary">
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
                                        {content[l.ky]}
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