import { alpha } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';


import { CollectionActions } from '../../Stores/CollectionStore';

const DownloadBlob = ({val, isImg}) => {
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        CollectionActions.download(val, setLink);
    }, []); // eslint-disable-line

    return (
        <Button target="_blank" href={link} download="blob" type="application/octet-stream" color="primary">
            {isImg ? (
                <img
                    src={link}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '5px',
                        width: '250px',
                        '&:hover': {
                            backgroundColor: alpha('#fff', 0.15),
                            boxShadow: '0 0 8px 1px rgba(0, 140, 186, 0.5)',
                        }
                    }}
                />
            ) : (
                <DownloadIcon color="primary" />
            )}
        </Button>
    );
};

DownloadBlob.defaultProps = {
    isImg: false,
};

DownloadBlob.propTypes = {
    val: PropTypes.string.isRequired,
    isImg: PropTypes.bool,
};

export default DownloadBlob;
