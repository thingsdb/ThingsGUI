/*eslint-disable react/jsx-props-no-spreading*/
import PropTypes from 'prop-types';
import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';


const CardButton = ({onClick, title, ...props}: Props) => (
    <Card
        sx={{
            width: 150,
            height: 150,
            textAlign: 'center',
            borderRadius: '50%',
            margin: '8px'
        }}
        raised
        {...props}
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
            {...props}
        >
            <Typography variant="overline" color="primary" >
                {title}
            </Typography>
        </CardActionArea>
    </Card>
);

CardButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    props: PropTypes.object,
};

export default CardButton;

interface Props {
    onClick: React.MouseEventHandler;
    title: string;
    props?: object;  // TODOT
}