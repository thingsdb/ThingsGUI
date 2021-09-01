import { makeStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';


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
            {header.map(h => (
                <React.Fragment key={h.ky}>
                    {h.title ? (
                        <Grid item xs={12} className={classes.grid}>
                            <Typography variant="subtitle2">
                                {h.title + ':'}
                            </Typography>
                            <Divider />
                        </Grid>
                    ) : null}
                    {h.labels.map(l => (
                        <Grid key={l.ky} container item xs={12}>
                            <Grid item xs={6}>
                                <Typography variant="caption">
                                    {l.label + ':'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">
                                    {l.fn ? l.fn(content[l.ky]) : content[l.ky]}
                                </Typography>
                            </Grid>
                        </Grid>
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