/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';


const useStyles = makeStyles(() => ({
    dragger: {
        cursor: 'ns-resize',
    },
    background: {
        backgroundColor: '#000',
    },
}));


const DragdownCard = ({children}) => {
    const classes = useStyles();

    const [isResizing, setIsResizing] = React.useState(false);
    const [newHeight, setNewHeight] = React.useState(200);

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMousemove);
            window.addEventListener('mouseup', handleMouseup);
        } else {
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[isResizing, handleMousemove, handleMouseup]);

    const handleMousedown = () => {
        setIsResizing(true);
    };

    const handleMousemove = React.useCallback((event) => {
        let el = document.getElementById('editor');
        let height = event.clientY - el.offsetTop;
        if (height > 100) {
            setNewHeight(height);
        }

    }, []);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, []);


    return (
        <Card id='editor' style={{height: newHeight}} className={classes.background}>
            {children(newHeight)}
            <Grid container item xs={12} alignItems="flex-end" justify="center" >
                <DragHandleIcon className={classes.dragger} onMouseDown={handleMousedown} />
            </Grid>
        </Card>
    );
};

DragdownCard.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DragdownCard;