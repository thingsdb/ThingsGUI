import Button from '@mui/material/Button';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';


const Copy = ({text}: Props) => {

    const setClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    return(
        <Tooltip disableFocusListener disableTouchListener title="Copy to Clipboard" sx={{marginLeft: '8px', marginRight: '8px'}}>
            <Button color="primary" onClick={setClipboard}>
                <FileCopyIcon color="primary" />
            </Button>
        </Tooltip>
    );
};

Copy.propTypes = {
    text: PropTypes.string.isRequired,
};

export default Copy;

interface Props {
    text: string;
}