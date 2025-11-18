import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';


const ArrayLayout = ({
    child,
    onAdd = () => null,
    onRemove,
    fullWidth = false,
}) => {
    const [count, setCount] = React.useState(1);

    const handleAdd = () => {
        setCount(count+1);
        onAdd(count);
    };

    const handleRemove = () => {
        setCount(count-1);
        onRemove(count-1);
    };

    const renderChildren = () => {
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(
                <Grid key={i} size={fullWidth?9:6}>
                    {child(i)}
                </Grid>
            );
        }
        return children;
    };

    return(
        <Grid container spacing={2}>
            {renderChildren()}
            <Grid container spacing={1} size={fullWidth?3:6} justifyContent="center" alignItems="center">
                <Grid>
                    <Fab color="primary" onClick={handleAdd} size="small" sx={{color: '#000'}}>
                        <AddIcon fontSize="small" />
                    </Fab>
                </Grid>
                <Grid>
                    <Fab color="primary" onClick={handleRemove} disabled={count==1} size="small" sx={{color: '#000'}}>
                        <RemoveIcon fontSize="small" />
                    </Fab>
                </Grid>
            </Grid>
        </Grid>

    );
};

ArrayLayout.propTypes = {
    child: PropTypes.func.isRequired,
    fullWidth: PropTypes.bool,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func.isRequired,
};

export default ArrayLayout;