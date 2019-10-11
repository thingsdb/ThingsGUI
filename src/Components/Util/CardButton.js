import PropTypes from 'prop-types';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';


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
                <Typography variant="overline" >
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