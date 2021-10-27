/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from '@mui/material/Slide';

import {CollectionActions} from '../../../Stores';
import {HarmonicCard} from '../../Utils';
import {TopBar} from '../../Navigation';
import Things from './TreeView';


const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit />;
});


const CollectionTree = ({collection}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        return CollectionActions.cleanupThings();
    }, [collection.collection_id]);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleRefresh = () => {
        CollectionActions.refreshThings(collection.name);
    };

    const handleCleanup = () => {
        CollectionActions.cleanupThings(collection.collection_id);
    };

    return(
        <React.Fragment>
            <HarmonicCard
                title="THINGS TREE"
                content={
                    <Things collection={collection} />
                }
                unmountOnExit
                onCleanup={handleCleanup}
                onRefresh={handleRefresh}
                actionButtons={
                    <Button color="primary" onClick={handleOpen} aria-label="close">
                        <OpenInNewIcon color="primary" />
                    </Button>
                }
            />
            <Dialog fullScreen open={open} onClose={handleOpen} TransitionComponent={Transition}>
                <div>
                    <TopBar
                        pageIcon={
                            <IconButton edge="start" color="primary" onClick={handleOpen} aria-label="close">
                                <ExpandMoreIcon />
                            </IconButton>
                        }
                    />
                </div>
                <DialogContent>
                    <Things collection={collection} />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

CollectionTree.propTypes = {
    collection: PropTypes.object.isRequired,
};

export default CollectionTree;