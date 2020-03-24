/*eslint-disable react/jsx-props-no-spreading*/

import { makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    card: {
        float: 'left',
        height: 30,
        textAlign: 'center',
        borderRadius: '30px',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    wrapper: {
        height: 30,
        textAlign: 'center',
        borderRadius: '30px',
        padding: theme.spacing(2),
    },
}));


const CardButton = ({buttons, label, ...other}) => {
    const classes = useStyles();
    return(
        <div
            className={classes.card}
            raised
            {...other}
        >
            <span className={classes.wrapper} {...other}>
                <Typography variant="caption" component="span">
                    {label}
                </Typography>
                {buttons.map((b, i)=>(
                    <IconButton onClick={b.onClick} size="small">
                        {b.icon}
                    </IconButton>
                ))}
            </span>
        </div>
    );
};

CardButton.defaultProps = {
    other: {},
};

CardButton.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    other: PropTypes.object,
};

export default CardButton;