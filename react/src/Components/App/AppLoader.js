import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';

import {ApplicationActions} from '../../Stores';

const RootGrid = styled(Grid)(() => ({
    flexGrow: 1,
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    maxWidth: 800,
    maxHeight: 800,
}));

const StyledImg = styled('img')(() => ({
    marginTop: 20,
}));

const WrapperGrid = styled(Grid)(() => ({
    width: 500,
    height: 250,
    textAlign: 'center',
}));


const AppLoader = ({connect}) => {
    React.useEffect(() => {
        if (connect) {
            ApplicationActions.connected();
        }
    }, [connect]);


    return(
        <RootGrid
            alignItems="center"
            container
            direction="row"
            spacing={3}
            justifyContent="center"
        >
            <Grid
                alignItems="center"
                container
                direction="column"
                spacing={3}
                justifyContent="center"
            >
                <WrapperGrid item xs={12}>
                    <Typography variant='h5'>
                        {'Loading...'}
                    </Typography>
                </WrapperGrid>
                <WrapperGrid item xs={12}>
                    <StyledImg
                        src="/img/thingsdb.gif"
                        alt="loading..."
                        draggable="false"
                        width="200"
                    />

                </WrapperGrid>
            </Grid>
        </RootGrid>
    );
};

AppLoader.propTypes = {
    connect: PropTypes.bool.isRequired,
};

export default AppLoader;