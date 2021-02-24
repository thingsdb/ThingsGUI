/*eslint-disable react/no-multi-comp*/
/*eslint-disable react/jsx-props-no-spreading*/
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PropTypes from 'prop-types';
import React from 'react';
import Slide from '@material-ui/core/Slide';

import {CollectionActions} from '../../../Stores';
import {HarmonicCard} from '../../Util';
import {TopBar} from '../../Navigation';
import Things from './TreeView';


const Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} mountOnEnter unmountOnExit />;
});


const CollectionTree = ({collection}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const handleRefresh = () => {
        CollectionActions.queryWithReturnDepth(collection.collection_id, collection.name);
    };
    return(
        <React.Fragment>
            <HarmonicCard
                title="THINGS TREE"
                content={
                    <Things collection={collection} />
                }
                unmountOnExit
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