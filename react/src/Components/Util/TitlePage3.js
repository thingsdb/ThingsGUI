import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const TitlePage3 = ({preTitle, title, content}) => (
    <Grid container spacing={1} sx={{marginBottom: '48px'}}>
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
        <Grid container item alignItems="flex-start">
            {content}
        </Grid>
    </Grid>
);

TitlePage3.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
};


export default TitlePage3;