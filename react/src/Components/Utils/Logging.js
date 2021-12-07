import { withVlow } from 'vlow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import React from 'react';
import Typography from '@mui/material/Typography';

import { DATE_TIME_MIN_STR } from '../../Constants/DateStrings';
import { THINGS_DOC_LOG_WARNING } from '../../Constants/Links';
import { EventStore } from '../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['logging']
}]);

const Logging = ({logging}) => (
    <Grid container spacing={1}>
        {logging.map((log) => (
            <Grid key={`${log.time.valueOf()}`} item xs={12}>
                <Typography variant="subtitle2" component="div" sx={{ display: 'flex' }}>
                    <Box sx={{ color: 'text.secondary', marginRight: '8px' }}>
                        {`${log.time.format(DATE_TIME_MIN_STR)} `}
                    </Box>
                    <Box>
                        {log.msg}
                    </Box>
                </Typography>
            </Grid>
        ))}
        {logging.length === 0 &&
            <Grid item xs={12}>
                <Typography variant="subtitle2">
                    {'No logging available'}
                </Typography>
            </Grid>
        }
        <Grid container item justifyContent="flex-end">
            <Box sx={{fontSize: 10, fontStyle: 'italic', m: 1}}>
                {'Visit the '}
                <Link target="_blank" href={THINGS_DOC_LOG_WARNING}>
                    {'documentation'}
                </Link>
                {' to learn more about logging'}
            </Box>
        </Grid>
    </Grid>
);

Logging.propTypes = {
    logging: EventStore.types.logging.isRequired,
};

export default withStores(Logging);

