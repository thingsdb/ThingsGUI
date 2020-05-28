/* eslint-disable react/no-multi-comp */
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@material-ui/icons/Remove';


const ArrayLayout = ({child, onRemove, fullWidth}) => {
    const [items, setItems] = React.useState(1);

    const handleAdd = () => {
        setItems(items+1);
    };

    const handleRemove = () => {
        setItems(items-1);
        onRemove(items-1);
    };

    const renderChildren = () => {
        const children = [];
        for (let i = 0; i < items; i++) {
            children.push(
                <Grid key={i} item xs={fullWidth?9:6}>
                    {child(i)}
                </Grid>
            );
        }
        return children;
    };

    return(

        <Grid container spacing={2}>
            {renderChildren()}
            <Grid container item spacing={1} xs={fullWidth?3:6} justify="center" alignItems="center">
                <Grid item>
                    <Fab color="primary" onClick={handleAdd} size="small">
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
                <Grid item>
                    <Fab color="primary" onClick={handleRemove} disabled={items==1} size="small">
                        <RemoveIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
        </Grid>

    );
};
ArrayLayout.defaultProps = {
    fullWidth: false,
};

ArrayLayout.propTypes = {
    child: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
};

export default ArrayLayout;