import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';

const useStyles = makeStyles(theme => ({
    bottom: {
        marginBottom: theme.spacing(6)
    },
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
        <Grid className={classes.bottom} direction="row" container spacing={1} alignItems="flex-start">
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

TitlePage2.defaultProps = {
    sideContent: null,
};

TitlePage2.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    sideContent: PropTypes.object,
    content: PropTypes.object.isRequired,
};


export default TitlePage2;