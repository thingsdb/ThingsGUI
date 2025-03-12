import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';

import { ErrorMsg, SimpleModal } from '.';


const RemoveModal = ({
    buttonComponent = null,
    buttonLabel = '',
    buttonProps = null,
    onClose = null,
    onSubmit,
    open = false,
    tag,
    title,
}: Props) => {
    const [show, setShow] = React.useState(false);
    const [switchDel, setSwitchDel] = React.useState(false);

    React.useEffect(() => {
        if(open) {
            setSwitchDel(false);
        }
    }, [open]);

    const handleClickOpen = () => {
        setShow(true);
        setSwitchDel(false);
    };

    const handleClickClose = () => {
        if(onClose) {
            onClose();
        } else {
            setShow(false);
        }
    };

    const handleSwitch = ({target}) => {
        const {checked} = target;
        setSwitchDel(checked);
    };

    const handleSubmit = () => onSubmit(() => setShow(false));

    return(
        <SimpleModal
            button={buttonComponent ?
                React.createElement(buttonComponent, {
                    ...buttonProps,
                    onClick: handleClickOpen,
                }, buttonLabel) : null
            }
            title={title}
            open={open || show}
            actionButtons={
                <Button color="error" disabled={!switchDel} onClick={handleSubmit}>
                    {'Submit'}
                </Button>
            }
            onClose={handleClickClose}
        >
            <React.Fragment>
                <ErrorMsg tag={tag} />
                <FormControlLabel
                    control={(
                        <Switch
                            checked={switchDel}
                            color="primary"
                            id="description"
                            onChange={handleSwitch}
                        />
                    )}
                    label="Are you really sure?"
                />
            </React.Fragment>
        </SimpleModal>
    );
};

RemoveModal.propTypes = {
    buttonComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    buttonLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    buttonProps: PropTypes.object,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool,
    tag: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default RemoveModal;

interface Props {
    buttonComponent: any;
    buttonLabel: any;
    buttonProps: any;
    onClose?: () => void;
    onSubmit: any;
    open?: boolean;
    tag: string;
    title: string;
}
