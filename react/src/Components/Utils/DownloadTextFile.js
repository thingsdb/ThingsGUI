import DownloadIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';


const DownloadTextFile = ({extension, name, text}) => {
    const [href, setHref] = React.useState(null);

    React.useEffect(() => {
        setHref(window.URL.createObjectURL(new Blob([text], {type: 'text/plain'})));
    }, [text]);

    return(
        <Tooltip disableFocusListener disableTouchListener title="Download" sx={{marginLeft: '8px', marginRight: '8px'}}>
            <Button color="primary" href={href} download={`thingsgui_${name || 'text'}${extension || ''}`}>
                <DownloadIcon color="primary" />
            </Button>
        </Tooltip>
    );
};

DownloadTextFile.defaultProps = {
    extension: '',
    name: '',
};

DownloadTextFile.propTypes = {
    extension: PropTypes.string,
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export default DownloadTextFile;
