import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Buttons = ({children}: Props) => {
    const [isMouseInside, setIsMouseInside] = React.useState(false);

    const mouseEnter = () => {
        setIsMouseInside(true);
    };

    const mouseLeave = () => {
        setIsMouseInside(false);
    };

    return (
        <div onMouseLeave={mouseLeave}>
            <span style={{visibility: isMouseInside?'visible':'hidden'}}>
                {children}
            </span>
            {!isMouseInside ? (
                <Button color="primary" onClick={mouseEnter}>
                    <MoreVertIcon color="primary" />
                </Button>
            ): null}
        </div>
    );

};

Buttons.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default Buttons;

interface Props {
    children: React.ReactNode;
}