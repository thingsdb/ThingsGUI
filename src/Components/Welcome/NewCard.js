
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(() => ({
    root: {
        width: 345,
        height: 310,
        display: 'flex',
    }
}));

const NewCard = ({onClick}) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={onClick}>
                <Grid container direction='column' justify='center' alignItems='center' spacing={2}>
                    <Grid item xs={12}>
                        <AddIcon fontSize='large' color='primary'/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='subtitle2' color='primary'>
                            {'New collection'}
                        </Typography>
                    </Grid>
                </Grid>
            </CardActionArea>
        </Card>
    );
};

NewCard.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default NewCard;