import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import React from 'react';
import PropTypes from 'prop-types';


const useStyles = makeStyles(() => ({
    cardAction: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0
    },
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
            <CardActions disableSpacing className={classes.cardAction}>
                <DragHandleIcon className={classes.dragger} onMouseDown={handleMousedown} />
            </CardActions>
        </Card>
    );
};

DragdownCard.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DragdownCard;