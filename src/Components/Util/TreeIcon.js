/* eslint-disable react/no-multi-comp */
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';


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
        return type === 'array' ? ['[ ]', 'green']
            : type == 'thing' ? ['{ }', 'blue']
                : type == 'str' ? ['S', 'orange']
                    : type == 'number' ? ['123', 'yellow']
                        : type == 'bool' ? ['1/0', 'pink']
                            : type == 'nil' ? ['NIL', 'red']
                                : type == 'bytes' ? ['BIN', 'purple']
                                    : type == 'closure' ? ['/', 'cyan']
                                        : type == 'regex' ? ['*', 'cyan']
                                            : type == 'error' ? ['!', 'cyan']
                                                : type == 'wrap' ? ['< >', 'lightPink']
                                                    : type == 'set' ? ['[ ]', 'green']
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
