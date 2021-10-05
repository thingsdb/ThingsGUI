import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


const Info = ({header, content}) => (
    <Grid container spacing={1}>
        {header.map(h => (
            <React.Fragment key={h.ky}>
                {h.title ? (
                    <Grid item xs={12} sx={{marginTop: '8px', marginBottom: '8px'}}>
                        <Typography variant="subtitle2">
                            {h.title + ':'}
                        </Typography>
                        <Divider />
                    </Grid>
                ) : null}
                {h.labels.map(l => (
                    <Grid key={l.ky} container item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="caption">
                                {l.label + ':'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">
                                {l.fn ? l.fn(content[l.ky]) : content[l.ky]}
                            </Typography>
                        </Grid>
                    </Grid>
                ))}
            </React.Fragment>
        ))}
    </Grid>
);

Info.propTypes = {
    header: PropTypes.arrayOf(PropTypes.object).isRequired,
    content: PropTypes.object.isRequired
};

export default Info;