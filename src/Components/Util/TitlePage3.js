import Box from '@material-ui/core/Box';
import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const TitlePage3 = ({preTitle, title, content}) => {

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" >
                            {preTitle}
                        </Typography>
                        <Typography variant="h3">
                            <Box fontWeight="fontWeightBold">
                                {title}
                            </Box>
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