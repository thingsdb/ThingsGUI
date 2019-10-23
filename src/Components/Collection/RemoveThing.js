import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

import BuildQueryString from './BuildQueryString';
import { ErrorMsg, SimpleModal } from '../Util';
import {CollectionActions} from '../../Stores/CollectionStore';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const tag = '3';
const RemoveThing = ({scope, thing, info}) => {
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
            info.id,
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
                            index: info.hasOwnProperty('index') ? info.index : null,
                            name: info.name,
                            type: null,
                            val: null,
                        }}
                        customTypes={{}}
                        parent={{
                            id: info.id,
                            name: info.hasOwnProperty('parentName') ? info.parentName : null,
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

    const title = info.hasOwnProperty('index') && info.index!=null ? `Remove ${info.name}[${info.index}]` : `Remove ${info.name}`;

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen} >
                    <DeleteIcon color="primary" />
                </ButtonBase>
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

RemoveThing. defaultProp = {
    thing: null,
};

RemoveThing.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.any,
    info: PropTypes.object.isRequired,
};

export default RemoveThing;
