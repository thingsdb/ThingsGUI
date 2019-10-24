/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import BuildIcon from '@material-ui/icons/Build';
import CodeIcon from '@material-ui/icons/Code';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import {withVlow} from 'vlow';
import {makeStyles} from '@material-ui/core/styles';

import RemoveThing from './RemoveThing';
import {ApplicationActions} from '../../Stores/ApplicationStore';
import {CollectionStore} from '../../Stores/CollectionStore';
import {TitlePage2, ThingsTree, WatchThings} from '../Util';


const withStores = withVlow([{
    store: CollectionStore,
    keys: ['things']
}]);

const useStyles = makeStyles(theme => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem: {
        margin: 0,
        padding: 0,
    },
}));


const ThingActions = ({child, parent, thing, scope}) => {
    const classes = useStyles();

    const [show, setShow] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const handleClickOpen = () => {
        setShow(true);
    };

    const handleClickClose = () => {
        setShow(false);
    };

    const handleClickOk = () => {
        // CollectionActions.rawQuery(
        //     scope,
        //     parent.id,
        //     query,
        //     tag,
        //     () => {
        //         ThingsdbActions.getCollections();
        //     }
        // );
        setShow(false);
    };

    const handleQuery = (q) => {
        setQuery(q);
    };

    // thing info
    const isTuple = parent.type === 'array' && child.type  === 'array';

    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: child.type==='object' ? `#${child.id}` : `#${parent.id}.${child.name}`, scope: scope});
    };

    // buttons visible

    const hasButtons = !(child.type === 'array' && child.name === '$' || child.name === '>' || parent.isTuple);
    const canAdd = (child.type === 'array' || child.type === 'object' || child.type === 'set') && !isTuple;
    const canEdit = child.name !== '$';
    const canToggle = child.type === 'object' || child.type === 'array' || child.type === 'set' || child.type === 'closure';
    const canWatch = thing && thing.hasOwnProperty('#');

    return (
        <React.Fragment>
            <ButtonBase onClick={handleClickOpen} >
                <BuildIcon color="primary" />
            </ButtonBase>
            <Dialog
                open={show}
                onClose={handleClickClose}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <TitlePage2
                        preTitle='Details of:'
                        title={child.name}
                        content={
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <ThingsTree tree={thing} />
                                </Grid>
                            </React.Fragment>
                        }
                        sideContent={
                            <React.Fragment>
                                <Grid item xs={12} container alignContent="center">
                                    <RemoveThing
                                        scope={scope}
                                        thing={thing}
                                        child={{
                                            index: child.index,
                                            name: child.name,
                                        }}
                                        parent={{
                                            id: parent.id,
                                            name: parent.name,
                                            type: parent.type
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} container alignContent="center">
                                    <Fab color="secondary" onClick={handleClickOpenEditor} >
                                        <CodeIcon fontSize="large" />
                                    </Fab>
                                </Grid>
                                {canWatch ? (
                                    <Grid item xs={12} container alignContent="center">
                                        <WatchThings
                                            buttonIsFab
                                            scope={scope}
                                            thingId={child.id}
                                        />
                                    </Grid>
                                ) : null}
                            </React.Fragment>
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose} color="primary">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleClickOk} color="primary">
                        {'Ok'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

ThingActions.defaultProps = {
    thing: null,
};


ThingActions.propTypes = {
    scope: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
    parent: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
};

export default withStores(ThingActions);
