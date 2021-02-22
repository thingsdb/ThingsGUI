import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    padding: {
        paddingTop: theme.spacing(1.50),
        paddingBottom: theme.spacing(1.75),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1.75),
    }
}));

const TitlePage2 = ({preTitle, title, sideContent, content}) => {
    const classes = useStyles();
    return (
        <Grid direction="row" container spacing={1} alignItems="flex-start">
            <Grid container spacing={1} item md={8} sm={12}>
                {content}
            </Grid>
            <Grid container spacing={1} item md={4} sm={12}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            action={title}
                            className={classes.padding}
                            title={preTitle}
                            titleTypographyProps={{
                                variant: 'body1',
                                display: 'inline',
                                noWrap: true,
                                component: 'span',
                            }}
                        />
                    </Card>
                </Grid>
                {sideContent}
            </Grid>
        </Grid>
    );
};

TitlePage2.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    sideContent: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
};


export default TitlePage2;