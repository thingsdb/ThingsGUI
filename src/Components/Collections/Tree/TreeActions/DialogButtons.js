/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import RemoveThing from './RemoveThing';
import WatchThings from './WatchThings';
import {ApplicationActions} from '../../../../Stores';
import {DownloadBlob} from '../../../Util';


const DialogButtons = ({child, customTypes, parent, realChildType, realParentType, scope, thing, tag}) => {

    const handleClickOpenEditor = () => {
        ApplicationActions.navigate({path: 'query', index: 0, item: child.type==='thing' ? `#${child.id}` : `#${parent.id}.${child.name}`, scope: scope});
    };

    // buttons visible
    const isRoot = child.name == 'root';
    const isParentCustom = Boolean(customTypes.find(c=>c.name==realParentType));
    const canRemove = !(child.name === '/' || parent.isTuple || isRoot || isParentCustom);
    const canWatch = thing && thing.hasOwnProperty('#');
    const canDownload = child.type === 'bytes';


    return (
        <React.Fragment>
            {canRemove &&
                <Grid item>
                    <RemoveThing
                        scope={scope}
                        thing={thing}
                        child={{...child, type: realChildType}}
                        parent={{...parent, type: realParentType||parent.type}}
                    />
                </Grid>
            }
            <Grid item>
                <Fab color="primary" onClick={handleClickOpenEditor} >
                    <CodeIcon fontSize="large" />
                </Fab>
            </Grid>
            {canWatch &&
                <Grid item>
                    <WatchThings
                        buttonIsFab
                        scope={scope}
                        thingId={child.id||parent.id}
                        tag={tag}
                    />
                </Grid>
            }
            {canDownload &&
                <Grid item>
                    <DownloadBlob
                        val={thing}
                    />
                </Grid>
            }
        </React.Fragment>
    );
};

DialogButtons.defaultProps = {
    thing: null,
};


DialogButtons.propTypes = {
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    parent: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        isTuple: PropTypes.bool,
    }).isRequired,
    realChildType: PropTypes.string.isRequired,
    realParentType: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    thing: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]),
};

export default DialogButtons;
