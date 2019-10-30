/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import InputField from './InputField';


const EditArray = ({child}) => {
    const [items, setItems] = React.useState(1);


    const handleClick = () => {
        setItems(items+1);
    };

    const renderChildren = () => {
        const children = [];
        for (let i = 0; i < items; i++) {
            children.push(
                <React.Fragment key={i}>
                    {child}
                </React.Fragment>
            );
        }
        return children;
    };

    return(
        <React.Fragment>
            {renderChildren()}
            <Fab color="secondary" onClick={handleClick} >
                <AddIcon fontSize="large" />
            </Fab>
        </React.Fragment>
    );
};


EditArray.propTypes = {
    child: PropTypes.object.isRequired,
};

export default EditArray;