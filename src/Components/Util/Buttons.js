import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const Buttons = ({children}) => {
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
