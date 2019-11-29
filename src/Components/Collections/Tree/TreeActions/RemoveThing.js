import PropTypes from 'prop-types';
import React from 'react';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import BuildQueryString from './BuildQueryString';
import { ErrorMsg, SimpleModal } from '../../../Util';
import {CollectionActions, ThingsdbActions} from '../../../../Stores';


const tag = '7';
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
        CollectionActions.queryWithReturn(
            scope,
            query,
            parent.id,
            tag,
            () => {
                ThingsdbActions.getCollections();
            }
        );
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
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
                            type: child.type,
                            val: null,
                        }}
                        customTypes={{}}
                        parent={{
                            id: parent.id,
                            name: parent.hasOwnProperty('name') ? parent.name : null,
                            type: parent.type,
                        }}
                        showQuery
                        query={query}
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

RemoveThing.defaultProps = {
    thing: null,
};

RemoveThing.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
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
