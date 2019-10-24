import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import BuildQueryString from './BuildQueryString';
import { ErrorMsg, SimpleModal } from '../Util';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const tag = '3';
const RemoveThing = ({scope, thing, child, parent}) => {
    const [show, setShow] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        CollectionActions.rawQuery(
            scope,
            parent.id,
            query,
            tag,
            () => {
                ThingsdbActions.getCollections();
            }
        );
        setShow(false);
    };

    const handleQuery = (q) => {
        setQuery(q);
    };

    const Content = (
        <React.Fragment>
            <List>
                <ListItem>
                    <BuildQueryString
                        action="remove"
                        cb={handleQuery}
                        child={{
                            id: thing && thing['#'],
                            index: child.hasOwnProperty('index') ? child.index : null,
                            name: child.name,
                            type: null,
                            val: null,
                        }}
                        customTypes={{}}
                        parent={{
                            id: parent.id,
                            name: parent.hasOwnProperty('name') ? parent.name : null,
                            type: null,
                        }}
                        showQuery
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
        </React.Fragment>
    );

    const title = child.hasOwnProperty('index') && child.index!=null ? `Remove ${parent.name}[${child.index}]` : `Remove ${child.name}`;

    return(
        <SimpleModal
            button={
                <Fab color="secondary" onClick={handleClickOpen} >
                    <DeleteIcon fontSize="large" />
                </Fab>
            }
            title={title}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

RemoveThing.defaultProps = {
    thing: null,
};

RemoveThing.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    child: PropTypes.shape({
        index: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

export default RemoveThing;
