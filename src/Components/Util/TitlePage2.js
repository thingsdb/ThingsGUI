import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const TitlePage2 = ({preTitle, title, sideContent, content}) => {

    return (
        <Grid container spacing={1} alignItems="flex-start">
            <Grid container spacing={1} item md={9} sm={12}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" >
                                {preTitle}
                            </Typography>
                            <Typography variant="h4" >
                                {title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {content}
            </Grid>
            <Grid container spacing={1} item md={3} sm={12}>
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