import { Link as RouterLink, createSearchParams, useSearchParams } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import { EDITOR_ROUTE } from '../../Constants/Routes';
import { THINGSDB_SCOPE } from '../../Constants/Scopes';

const QueryEditorMenu = () => {
    let [searchParams] = useSearchParams();
    let scopeParam = searchParams.get('scope');
    let current = Object.fromEntries(searchParams);
    return(
        <List dense>
            <ListItem
                button
                component={RouterLink}
                to={{pathname: `/${EDITOR_ROUTE}`, search: createSearchParams({
                    ...current,
                    scope: scopeParam || THINGSDB_SCOPE
                }).toString()}}
            >
                <ListItemIcon>
                    <CodeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="EDITOR" />
            </ListItem>
        </List>
    );
};

export default QueryEditorMenu;
