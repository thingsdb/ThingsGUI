import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import DialogContentText from '@material-ui/core/DialogContentText';

import { ErrorMsg, SimpleModal } from '../../Util';
import {NodesActions} from '../../../Stores';


const tag = '18';

const Remove = ({node}) => {
    const [show, setShow] = React.useState(false);

    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        NodesActions.delNode(
            node.node_id,
            tag,
            () => setShow(false)
        );
    };

    const handleKeyPress = (event) => {
        const {key} = event;
        if (key == 'Enter') {
            handleClickOk();
        }
    };


    const Content = (
        <React.Fragment>
            <ErrorMsg tag={tag} />
            <DialogContentText>
                {'Are you sure you want to remove the latest node?'}
            </DialogContentText>
        </React.Fragment>
    );

    return(
        <SimpleModal
            button={
                <ButtonBase onClick={handleClickOpen}>
                    <DeleteIcon color="primary" />
                </ButtonBase>
            }
            title="CAUTION"
            open={show}
            onOk={handleClickOk}
            onClose={handleClickClose}
            onKeyPress={handleKeyPress}
        >
            {Content}
        </SimpleModal>
    );
};

Remove.propTypes = {
    node: PropTypes.object.isRequired,
};

export default Remove;