import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ErrorMsg, SimpleModal } from '../../../Util';
import {CollectionActions, ThingsdbActions} from '../../../../Stores';
import {RemoveThingTAG} from '../../../../Constants/Tags';
import {SET, THING} from '../../../../Constants/ThingTypes';


const tag = RemoveThingTAG;
const RemoveThing = ({child, onClose, parent, scope}) => {
    const [show, setShow] = React.useState(false);
    const [query, setQuery] = React.useState('');

    React.useEffect(() => {
        const q = parent.type === THING ? `#${parent.id}.del('${child.name}');`
            : parent.type === SET ? `#${parent.id}.${parent.name}.remove(#${child.id});`
                : `#${parent.id}.${parent.name}.splice(${child.index}, 1);`;
        setQuery(q);
    }, [child.index, child.id, child.name, parent.id, parent.name, parent.type]);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        CollectionActions.query(
            scope,
            query,
            tag,
            () => {
                ThingsdbActions.getCollections();
            },
            parent.id,
        );
        onClose();
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };

    const Content = (
        <List>
            <ListItem>
                <TextField
                    fullWidth
                    label="Query"
                    maxRows={4}
                    multiline
                    name="queryString"
                    type="text"
                    value={query}
                    variant="standard"
                    InputProps={{
                        readOnly: true,
                        disableUnderline: true,
                    }}
                    inputProps={{
                        style: {
                            fontFamily: 'monospace',
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </ListItem>
            <ListItem>
                <ErrorMsg tag={tag} />
            </ListItem>
            <ListItem>
                <Typography>
                    {'Are you sure?'}
                </Typography>
            </ListItem>
        </List>
    );

    const title = `Remove ${child.name}`;

    return(
        <SimpleModal
            button={
                <Fab color="primary" onClick={handleClickOpen} sx={{color: '#000'}}>
                    <DeleteIcon fontSize="large" />
                </Fab>
            }
            title={title}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyDown={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

RemoveThing.propTypes = {
    onClose: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

export default RemoveThing;
