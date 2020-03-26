/*eslint-disable react/jsx-props-no-spreading*/

import { makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    card: {
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        border: 'none',
        borderRadius: '16px',
        boxSizing: 'border-box',
        color: 'rgba(0, 0, 0, 0.87)',
        cursor: 'default',
        display: 'inline-flex',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '0.8125rem',
        height: '32px',
        justifyContent: 'center',
        margin: theme.spacing(1),
        outline: 0,
        padding: 0,
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
    },
    text: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        paddingLeft: '12px',
        paddingRight: '12px',
        textOverflow: 'ellipsis',
        boxSizing: 'inherit',
    },
    button: {
        color: theme.palette.background.paper,
        cursor: 'pointer',
        margin: '0 5px 0 -6px',
        '-webkit-tap-highlight-color': 'transparent',
        fill: 'currentColor',
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: '1.5rem',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        flexShrink: 0,
        userSelect: 'none',
        boxSizing: 'inherit',
        overflow: 'hidden',
    },
}));


const CardMultiButton = ({buttons, label, ...other}) => {
    const classes = useStyles();
    return(
        <div
            className={classes.card}
            {...other}
        >
            <span className={classes.text} {...other}>
                <Typography variant="caption" component="span" color="inherit">
                    {label}
                </Typography>
            </span>
            {buttons.map((b, i)=>(
                <IconButton className={classes.button} key={i} onClick={b.onClick} size="small">
                    {b.icon}
                </IconButton>
            ))}

        </div>
    );
};

CardMultiButton.defaultProps = {
    other: {},
};

CardMultiButton.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    other: PropTypes.object,
};

export default CardMultiButton;