import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2),
    },
    grid: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const Info = ({header, content}) => {
    const classes = useStyles();
    
    return (
        <Grid container className={classes.root}>
            {header.map((h) => (
                <React.Fragment key={h.ky}>
                    <Grid item xs={12} className={classes.grid}>
                        <Typography variant={'caption'}>
                                {h.title + ':'}
                        </Typography>
                        <Divider />
                    </Grid>
                    {h.labels.map((l) => (
                        <React.Fragment key={l.ky}>
                            <Grid container item xs={12} spacing={1}>
                                <Grid item xs={6}>
                                    <Typography variant={'caption'}>
                                        {l.label + ':'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={'subtitle2'}>
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
    header: PropTypes.array.isRequired,
    content: PropTypes.object.isRequired
};

export default Info;