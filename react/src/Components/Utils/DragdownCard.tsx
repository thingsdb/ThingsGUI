import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import React from 'react';
import PropTypes from 'prop-types';


const DragdownCard = ({children}: Props) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const [newHeight, setNewHeight] = React.useState(500);

    const handleMousemove = React.useCallback((event: MouseEvent) => {
        let el = document.getElementById('editor');
        let height = event.clientY - el.offsetTop;
        if (height > 100) {
            setNewHeight(height);
        }

    }, []);

    const handleMouseup = React.useCallback(() => {
        setIsResizing(false);
    }, []);

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

    return (
        <Card id='editor' style={{height: newHeight}}>
            {children(newHeight)}
            <CardActions sx={{alignItems:'flex-end', justifyContent: 'center', padding: 0}}>
                <DragHandleIcon onMouseDown={handleMousedown} sx={{cursor: 'ns-resize'}} />
            </CardActions>
        </Card>
    );
};

DragdownCard.propTypes = {
    children: PropTypes.func.isRequired,
};

export default DragdownCard;

interface Props {
    children: (height: number) => React.ReactNode;
}