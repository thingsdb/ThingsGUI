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

const TitlePage = ({preTitle, title, content}) => {
    const classes = useStyles();
    return (
        <Grid className={classes.bottom} container spacing={1}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="body1" >
                            {preTitle}
                        </Typography>
                        <Typography variant="h4">
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

TitlePage.propTypes = {
    preTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
};


export default TitlePage;