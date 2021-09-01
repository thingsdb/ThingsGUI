import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    bottom: {
        marginBottom: theme.spacing(6)
    },
}));

const TitlePage3 = ({preTitle, title, content}) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1} className={classes.bottom}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" >
                            {preTitle}
                        </Typography>
                        <Typography variant="h3">
                            {title}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid container item spacing={1} alignItems="flex-start">
                {content}
            </Grid>
        </Grid>
    );
};

TitlePage3.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
};


export default TitlePage3;