import { withVlow } from 'vlow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';
import Typography from '@mui/material/Typography';

import { DATE_TIME_MIN_STR } from '../../Constants/DateStrings';
import { THINGS_DOC_LOG_WARNING } from '../../Constants/Links';
import { EventActions, EventStore } from '../../Stores';

const withStores = withVlow([{
    store: EventStore,
    keys: ['logging']
}]);

const Logging = ({logging}: IEventStore) => (
    <List dense disablePadding>
        <Collapse in={Array.isArray(logging) && logging.length > 1}>
            <ListItem sx={{ justifyContent: 'flex-end' }}>
                <Button color="primary" onClick={() =>  EventActions.clearLogging()}>
                    {'Clear all'}
                </Button>
            </ListItem>
        </Collapse>
        {logging.map((log, index) => (
            <ListItem
                key={`${log.time.valueOf()}`}
                secondaryAction={
                    <IconButton
                        color="primary"
                        onClick={() =>  EventActions.clearLogEntry(index)}
                        size="small"
                    >
                        <ClearIcon />
                    </IconButton>
                }
            >
                <Typography variant="subtitle2" component="div" sx={{ display: 'flex' }}>
                    <Box sx={{ color: 'text.secondary', marginRight: '8px' }}>
                        {`${log.time.format(DATE_TIME_MIN_STR)} `}
                    </Box>
                    <Box>
                        {log.msg}
                    </Box>
                </Typography>
            </ListItem>
        ))}
        {logging.length === 0 &&
            <ListItem>
                <Typography variant="subtitle2">
                    {'No logging available'}
                </Typography>
            </ListItem>
        }
        <ListItem sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{fontSize: 10, fontStyle: 'italic', m: 1}}>
                {'Visit the '}
                <Link target="_blank" href={THINGS_DOC_LOG_WARNING}>
                    {'documentation'}
                </Link>
                {' to learn more about logging'}
            </Box>
        </ListItem>
    </List>
);

Logging.propTypes = {
    logging: EventStore.types.logging.isRequired,
};

export default withStores(Logging);
