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
    purple: {
        color: theme.palette.primary.purple,
    },

}));


const TreeIcon = ({type}) => {
    const classes = useStyles();

    const treeIcon = (type) => {
        return type === 'array' ? ['[ ]', 'green']
            : type == 'object' ? ['{ }', 'blue']
                : type == 'string' ? ['S', 'orange']
                    : type == 'number' ? ['123', 'yellow']
                        : type == 'boolean' ? ['1/0', 'pink']
                            : type == 'set' ? ['SET', 'purple']
                                : type == 'nil' ? ['NIL', 'red']
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