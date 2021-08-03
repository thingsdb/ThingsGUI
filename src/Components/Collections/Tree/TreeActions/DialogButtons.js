import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import CodeIcon from '@material-ui/icons/Code';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';

import {EDITOR_ROUTE} from '../../../../Constants/Routes';
import {historyNavigate} from '../../../Util';
import {ROOM, THING} from '../../../../Constants/ThingTypes';
import {THING_KEY} from '../../../../Constants/CharacterKeys';
import JoinRoom from './JoinRoom';
import RemoveThing from './RemoveThing';


const DialogButtons = ({child, customTypes, onClose, parent, realChildType, realParentType, scope, tag, thing, isRoot}) => {
    let history = useHistory();

    const handleClickOpenEditor = () => {
        historyNavigate(history, `/${EDITOR_ROUTE}`, {scope: scope, query: child.type===THING ? `#${child.id}` : `#${parent.id}.${child.name}`});
    };

    // buttons visible
    const isParentCustom = Boolean(customTypes.find(c => c.name === realParentType));
    const canRemove = Boolean(!(isRoot || isParentCustom || parent.isTuple));
    const isRoom = realChildType === ROOM;

    return (
        <React.Fragment>
            {canRemove &&
                <Grid item>
                    <RemoveThing
                        onClose={onClose}
                        scope={scope}
                        child={{
                            id: thing ? thing[THING_KEY]:null,
                            index: child.hasOwnProperty('index') ? child.index : null,
                            name: child.name,
                            type: realChildType,
                            val: null,
                        }}
                        parent={{
                            id: parent.id,
                            name: parent.hasOwnProperty('name') ? parent.name : null,
                            type: realParentType||parent.type
                        }}
                    />
                </Grid>
            }
            <Grid item>
                <Fab color="primary" onClick={handleClickOpenEditor} >
                    <CodeIcon fontSize="large" />
                </Fab>
            </Grid>
            {isRoom &&
                <Grid item>
                    <JoinRoom
                        scope={scope}
                        room={child.val}
                        tag={tag}
                    />
                </Grid>
            }
        </React.Fragment>
    );
};

DialogButtons.defaultProps = {
    thing: null,
    isRoot: false,
};


DialogButtons.propTypes = {
    child: PropTypes.shape({
        id: PropTypes.number,
        index: PropTypes.number,
        name: PropTypes.string,
        type: PropTypes.string,
        val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    customTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
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
    isRoot: PropTypes.bool,
};

export default DialogButtons;
