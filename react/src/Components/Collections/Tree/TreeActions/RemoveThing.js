import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ErrorMsg, SimpleModal } from '../../../Utils';
import { CollectionActions, ThingsdbActions } from '../../../../Stores';
import { RemoveThingTAG } from '../../../../Constants/Tags';
import { SET, THING } from '../../../../Constants/ThingTypes';
import {
    THING_LIST_DEL_ARGS,
    THING_PROP_DEL_ARGS,
    THING_SET_REMOVE_ARGS,
} from '../../../../TiQueries/Arguments';
import {
    THING_LIST_DEL_QUERY,
    THING_PROP_DEL_QUERY,
    THING_SET_REMOVE_QUERY,
    THING_LIST_DEL_FORMAT_QUERY,
    THING_PROP_DEL_FORMAT_QUERY,
    THING_SET_REMOVE_FORMAT_QUERY
} from '../../../../TiQueries/Queries';

const tag = RemoveThingTAG;
const RemoveThing = ({child, onClose, parent, scope}) => {
    const [show, setShow] = React.useState(false);
    const [state, setState] = React.useState({
        jsonArgs: '',
        query: '',
        queryString: '',
    });

    React.useEffect(() => {
        let qs, q, a = '';
        if (parent.type === THING) {
            qs = THING_PROP_DEL_FORMAT_QUERY(parent.id, child.name);
            q = THING_PROP_DEL_QUERY;
            a = THING_PROP_DEL_ARGS(parent.id, child.name);
        } else if (parent.type === SET) {
            qs = THING_SET_REMOVE_FORMAT_QUERY(parent.id, parent.name, child.id);
            q = THING_SET_REMOVE_QUERY;
            a = THING_SET_REMOVE_ARGS(parent.id, parent.name, child.id);

        } else {
            qs = THING_LIST_DEL_FORMAT_QUERY(parent.id, parent.name, child.index);
            q = THING_LIST_DEL_QUERY;
            a = THING_LIST_DEL_ARGS(parent.id, parent.name, child.index);
        }
        setState({
            jsonArgs: a,
            query: q,
            queryString: qs,
        });
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
            state.query,
            tag,
            () => {
                ThingsdbActions.getCollections();
            },
            parent.id,
            null,
            state.jsonArgs
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
                    value={state.queryString}
                    variant="standard"
                    slotProps={{
                        input: {
                            readOnly: true,
                            disableUnderline: true,
                        },
                        htmlInput: {
                            style: {
                                fontFamily: 'monospace',
                            },
                        },
                        inputLabel: {
                            shrink: true,
                        }
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
