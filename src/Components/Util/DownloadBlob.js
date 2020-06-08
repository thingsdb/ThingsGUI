/* eslint-disable react/no-multi-comp */
/* eslint-disable react-hooks/exhaustive-deps */
import {fade, makeStyles} from '@material-ui/core/styles';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Fab from '@material-ui/core/Fab';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

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
        // margin: theme.spacing(2),
    },
}));

const DownloadBlob = ({val, isFab, isImg}) => {
    const classes = useStyles();
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        CollectionActions.download(val, handleLink);
    }, []);

    const handleLink = (link) => {
        setLink(link);
    };

    return (
        <Tooltip disableFocusListener disableTouchListener title="Download blob">
            <Link target="_blank" href={link} download="blob" type="application/octet-stream" color="textPrimary">
                {isFab ? (
                    <Fab color="primary" >
                        <DownloadIcon fontSize="large" />
                    </Fab>
                ) : isImg ? (
                    <img
                        src={link}
                        className={classes.img}
                    />
                ) : (
                    <DownloadIcon color="primary" />
                )}
            </Link>
        </Tooltip>
    );
};

DownloadBlob.defaultProps = {
    isFab: false,
    isImg: false,
};

DownloadBlob.propTypes = {
    val: PropTypes.string.isRequired,
    isFab: PropTypes.bool,
    isImg: PropTypes.bool,
};

export default DownloadBlob;
