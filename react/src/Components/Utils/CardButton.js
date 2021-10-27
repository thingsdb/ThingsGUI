/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';


const CardButton = ({onClick, title, ...other}) => (
    <Card
        sx={{
            width: 150,
            height: 150,
            textAlign: 'center',
            borderRadius: '50%',
            margin: '8px'
        }}
        raised
        {...other}
    >
        <CardActionArea
            focusRipple
            sx={{
                width: 150,
                height: 150,
                textAlign: 'center',
                borderRadius: '50%',
                padding: '16px'
            }}
            onClick={onClick}
            {...other}
        >
            <Typography variant="overline" color="primary" >
                {title}
            </Typography>
        </CardActionArea>
    </Card>
);

CardButton.defaultProps = {
    other: {},
};

CardButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    other: PropTypes.object,
};

export default CardButton;