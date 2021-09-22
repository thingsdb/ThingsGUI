/*eslint-disable react/jsx-props-no-spreading*/

import PropTypes from 'prop-types';
import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';


const useStyles = makeStyles(theme => ({
    card: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        margin: theme.spacing(1),
    },
    wrapper: {
        width: 150,
        height: 150,
        textAlign: 'center',
        borderRadius: '50%',
        padding: theme.spacing(2),
    },
}));


const CardButton = ({onClick, title, ...other}) => {
    const classes = useStyles();

    const handleClick = () => {
        onClick();
    };

    return(
        <Card
            className={classes.card}
            raised
            {...other}
        >
            <CardActionArea
                focusRipple
                className={classes.wrapper}
                onClick={handleClick}
                {...other}
            >
                <Typography variant="overline" color="primary" >
                    {title}
                </Typography>
            </CardActionArea>
        </Card>
    );
};

CardButton.defaultProps = {
    other: {},
};

CardButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    other: PropTypes.object,
};

export default CardButton;