import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';


const TitlePage3 = ({preTitle, title, content}: Props) => (
    <Grid container spacing={1} sx={{marginBottom: '48px'}}>
        <Grid size={12}>
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
        <Grid container spacing={1} direction="row">
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

interface Props {
    preTitle: string;
    title: string;
    content: React.ReactNode;
}