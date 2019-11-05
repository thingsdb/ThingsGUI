/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';


const ArrayLayout = ({child}) => {
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
                    {child(i)}
                </Grid>
            );
        }
        return children;
    };

    return(
        <Grid container spacing={2}>
            {renderChildren()}

            <Grid container item spacing={1} xs={6} justify="center" alignItems="center">
                <Grid item>
                    <Fab color="secondary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
                <Grid item>
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