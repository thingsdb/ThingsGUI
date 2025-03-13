import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';


const TitlePage2 = ({
    preTitle,
    title,
    sideContent = null,
    content,
}: Props) => (
    <Grid direction="row" container spacing={1} alignItems="flex-start" sx={{marginBottom: '48px'}}>
        <Grid container spacing={1} size={{md: 12, lg: 8}}>
            <Grid size={12} sx={{display: { lg: 'none', xs: 'block'}}}>
                <Card>
                    <CardHeader
                        action={title}
                        title={preTitle}
                        slotProps={{title: {
                            variant: 'body2',
                            display: 'inline',
                            noWrap: true,
                            component: 'span',
                        }}}
                        sx={{
                            paddingTop: '10px',
                            paddingBottom: '8px',
                            paddingLeft: '16px',
                            paddingRight: '32px',
                        }}
                    />
                </Card>
            </Grid>
            {content}
        </Grid>
        <Grid container spacing={1} size={{md: 12, lg: 4}}>
            <Grid size={12} sx={{display: { xs: 'none', md: 'block' }}}>
                <Card>
                    <CardHeader
                        action={title}
                        title={preTitle}
                        slotProps={{title: {
                            variant: 'body2',
                            display: 'inline',
                            noWrap: true,
                            component: 'span',
                        }}}
                        sx={{
                            paddingTop: '10px',
                            paddingBottom: '8px',
                            paddingLeft: '16px',
                            paddingRight: '32px',
                        }}
                    />
                </Card>
            </Grid>
            {sideContent}
        </Grid>
    </Grid>
);

TitlePage2.propTypes = {
    preTitle: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    sideContent: PropTypes.object,
    content: PropTypes.object.isRequired,
};


export default TitlePage2;

interface Props {
    preTitle: string;
    title: React.ReactNode;
    sideContent: React.ReactNode;
    content: React.ReactNode;
}