/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import RemoveIcon from '@material-ui/icons/Remove';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: theme.palette.secondary.main,
        padding: theme.spacing(2),
    },
}));


const ArrayLayout = ({child}) => {
    const classes = useStyles();
    const [items, setItems] = React.useState(1);

    const handleAdd = () => {
        setItems(items+1);
    };

    const handleRemove = () => {
        setItems(items-1);
    };

    const renderChildren = () => {
        const children = [];
        for (let i = 0; i < items; i++) {
            children.push(
                <Grid key={i} item xs={6}>
                    <Card className={classes.card} raised>
                        {child(i)}
                    </Card>
                </Grid>
            );
        }
        return children;
    };

    return(
        <Grid container spacing={2}>
            <Grid container item xs={12} spacing={2}>
                {renderChildren()}
            </Grid>
            <Grid container item xs={12} justify="flex-end">
                <Grid item xs={2}>
                    <Fab color="secondary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
                <Grid item xs={2}>
                    <Fab color="secondary" onClick={handleRemove} disabled={items==1} size="small">
                        <RemoveIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
        </Grid>
    );
};


ArrayLayout.propTypes = {
    child: PropTypes.func.isRequired,
};

export default ArrayLayout;