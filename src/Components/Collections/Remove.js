import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';

import { ErrorMsg, SimpleModal } from '../Util';
import {ThingsdbActions} from '../../Stores/ThingsdbStore';


const tag = '6';

const Remove = ({collection}) => {
    const [show, setShow] = React.useState(false);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setName(collection.name);
    }, []);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        ThingsdbActions.removeCollection(
            collection.name,
            tag,
            () => setShow(false)
        );

    };

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Remove'}
                </Button>
            }
            title={`Remove collection ${name}?`}
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            <ErrorMsg tag={tag} />
        </SimpleModal>
    );
};

Remove.propTypes = {
    /* collections properties */
    collection: PropTypes.object.isRequired,
};

export default Remove;