import {fade, makeStyles} from '@material-ui/core/styles';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';

import {CollectionActions} from '../../Stores/CollectionStore';

const useStyles = makeStyles(theme => ({
    img: {
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '5px',
        width: '250px',
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.15),
            boxShadow: '0 0 8px 1px rgba(0, 140, 186, 0.5)',
        },
    },
}));

const DownloadBlob = ({val, isImg}) => {
    const classes = useStyles();
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        CollectionActions.download(val, handleLink);
    }, [handleLink, val]);

    const handleLink = React.useCallback((link) => {
        setLink(link);
    }, []);

    return (
        <Button target="_blank" href={link} download="blob" type="application/octet-stream" color="primary">
            {isImg ? (
                <img
                    src={link}
                    className={classes.img}
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
