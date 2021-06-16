import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import {CLOSURE_KEY, ERROR_KEY, REGEX_KEY, SET_KEY, THING_KEY, WRAP_KEY} from '../../Constants/CharacterKeys';
import {ARRAY, BOOL, BYTES, CLOSURE, ERROR, NIL, NUMBER, REGEX,
    SET, STR, THING, WRAP} from '../../Constants/ThingTypes';

const useStyles = makeStyles(theme => ({
    red: {
        color: theme.palette.primary.red,
    },
    orange: {
        color: theme.palette.primary.orange,
    },
    yellow: {
        color: theme.palette.primary.yellow,
    },
    green: {
        color: theme.palette.primary.green,
    },
    blue: {
        color: theme.palette.primary.blue,
    },
    pink: {
        color: theme.palette.primary.pink,
    },
    lightPink: {
        color: theme.palette.primary.lightPink,
    },
    purple: {
        color: theme.palette.primary.purple,
    },
    cyan: {
        color: theme.palette.primary.cyan,
    },
    beige: {
        color: theme.palette.primary.beige,
    },
    white: {
        color: theme.palette.primary.white,
    },

}));


const TreeIcon = ({type}) => {
    const classes = useStyles();

    const treeIcon = (type) => {
        return type === ARRAY ? ['[ ]', 'green']
            : type == THING ? [THING_KEY, 'blue']
                : type == STR ? ['S', 'orange']
                    : type == NUMBER ? ['123', 'yellow']
                        : type == BOOL ? ['1/0', 'pink']
                            : type == NIL ? ['NIL', 'red']
                                : type == BYTES ? ['BIN', 'purple']
                                    : type == CLOSURE ? [CLOSURE_KEY, 'cyan']
                                        : type == REGEX ? [REGEX_KEY, 'cyan']
                                            : type == ERROR ? [ERROR_KEY, 'cyan']
                                                : type == WRAP ? [WRAP_KEY, 'lightPink']
                                                    : type == SET ? [SET_KEY, 'green']
                                                        : type == 'object' ? ['{ }', 'white']
                                                            : '';
    };
    const [icon, color] = treeIcon(type);


    return (
        <ButtonBase className={classes[color]} disabled>
            <Typography variant="button">
                {icon}
            </Typography>
        </ButtonBase>
    );
};

TreeIcon.defaultProps = {
    type: null,
};

TreeIcon.propTypes = {
    type: PropTypes.string,
};

export default TreeIcon;
