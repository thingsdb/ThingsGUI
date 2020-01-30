/* eslint-disable react/no-multi-comp */
import DownloadIcon from '@material-ui/icons/SaveAlt';
import Fab from '@material-ui/core/Fab';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import {CollectionActions} from '../../Stores/CollectionStore';



const TreeBranch = ({val, isFab}) => {
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        CollectionActions.download(val, handleLink);
    }, []);

    const handleLink = (link) => {
        setLink(link);
    };

    return (
        <React.Fragment>
            <Tooltip disableFocusListener disableTouchListener title="Download blob">
                <Link href={link} download="blob" type="application/octet-stream" color="textPrimary">
                    {isFab ? (
                        <Fab color="primary" >
                            <DownloadIcon fontSize="large" />
                        </Fab>
                    ) : (
                        <DownloadIcon color="primary" />
                    )}
                </Link>
            </Tooltip>
        </React.Fragment>
    );
};

TreeBranch.defaultProps = {
    isFab: true,
};

TreeBranch.propTypes = {
    val: PropTypes.string.isRequired,
    isFab: PropTypes.bool,
};

export default TreeBranch;
