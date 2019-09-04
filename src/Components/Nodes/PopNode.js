import React from 'react';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';

import { ErrorMsg, SimpleModal } from '../Util';
import {NodesActions} from '../../Stores/NodesStore';


const tag = '11';

const PopNode = () => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.popNode(tag, () => setShow(false));
    };


    const Content = (
        <React.Fragment>
            <DialogContentText>
                {'Are you sure you want to remove the latest node?'}
            </DialogContentText>
            <ErrorMsg tag={tag} />
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <Button variant="outlined" onClick={handleClickOpen}>
                    {'Pop Node'}
                </Button>
            }
            title="CAUTION"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
        >
            {Content}
        </SimpleModal>
    );
};

export default PopNode;