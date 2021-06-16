import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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
        CollectionActions.queryWithReturn(
            scope,
            query,
            parent.id,
            tag,
            () => {
                ThingsdbActions.getCollections();
            }
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
                    name="queryString"
                    label="Query"
                    type="text"
                    value={query}
                    fullWidth
                    multiline
                    rowsMax={4}
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
                <Fab color="primary" onClick={handleClickOpen} >
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
