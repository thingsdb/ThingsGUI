import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const TitlePage = ({preTitle, title, content}) => (
    <Grid container spacing={1} sx={{marginBottom: '48px'}}>
        <Grid size={12}>
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
        <Grid container spacing={1} alignItems="flex-start">
            {content}
        </Grid>
    </Grid>
);

TitlePage.propTypes = {
    preTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]).isRequired,
};


export default TitlePage;