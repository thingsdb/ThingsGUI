import {makeStyles} from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles(theme => ({
    padding: {
        paddingTop: theme.spacing(1.25),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(4),
    }
}));

const TitlePage2 = ({preTitle, title, sideContent, content}) => {
    const classes = useStyles();
    return (
        <Grid direction="row" container spacing={1} alignItems="flex-start">
            <Grid container spacing={1} item lg={8} md={12}>
                <Hidden lgUp>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                action={title}
                                className={classes.padding}
                                title={preTitle}
                                titleTypographyProps={{
                                    variant: 'body2',
                                    display: 'inline',
                                    noWrap: true,
                                    component: 'span',
                                }}
                            />
                        </Card>
                    </Grid>
                </Hidden>
                {content}
            </Grid>
            <Grid container spacing={1} item lg={4} md={12}>
                <Hidden mdDown>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                action={title}
                                className={classes.padding}
                                title={preTitle}
                                titleTypographyProps={{
                                    variant: 'body2',
                                    display: 'inline',
                                    noWrap: true,
                                    component: 'span',
                                }}
                            />
                        </Card>
                    </Grid>
                </Hidden>
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