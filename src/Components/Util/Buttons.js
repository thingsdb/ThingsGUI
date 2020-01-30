import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
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
                <ButtonBase onClick={mouseEnter}>
                    <MoreVertIcon color="primary" />
                </ButtonBase>
            ): null}
        </div>
    );

};

Buttons.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
};


export default Buttons;
