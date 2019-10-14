import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const TitlePage2 = ({preTitle, title, headerContent, content}) => {

    return (
        <Grid container spacing={1}>
            <Grid container spacing={1} item xs={12}>
                <Grid item xs={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="body1" >
                                {preTitle}
                            </Typography>
                            <Typography variant="h4" color='primary'>
                                {title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardContent>
                            {headerContent}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container item spacing={1} >
                {content}
            </Grid>
        </Grid>
    );
};

TitlePage2.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    headerContent: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
};


export default TitlePage2;