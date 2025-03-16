/*eslint-disable react/jsx-props-no-spreading*/

import { amber } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@mui/material/Typography';


const SCard = styled('div', {shouldForwardProp: (prop) => prop !== 'warn'})(
    ({ theme, warn }) => ({
        alignItems: 'center',
        backgroundColor: warn ? amber[700] : theme.palette.primary.main,
        border: 'none',
        borderRadius: '16px',
        boxSizing: 'border-box',
        color: 'rgba(0, 0, 0, 0.87)',
        cursor: 'default',
        display: 'inline-flex',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '0.8125rem',
        height: '32px',
        justifyContent: 'center',
        margin: theme.spacing(1),
        outline: 0,
        padding: 0,
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
    })
);

const Text = styled('span')(() => ({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    paddingLeft: '12px',
    paddingRight: '12px',
    textOverflow: 'ellipsis',
    boxSizing: 'inherit',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.background.paper,
    cursor: 'pointer',
    margin: '0px 5px 0px -6px',
    padding: 0,
    webkitTapHighlightColor: 'transparent',
    fill: 'currentColor',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fontSize: '1.5rem',
    transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    flexShrink: 0,
    userSelect: 'none',
    boxSizing: 'inherit',
    overflow: 'hidden',
}));


const CardMultiButton = ({
    buttons,
    label,
    warn = false
}: Props) => {
    return(
        <SCard warn={warn}>
            <Text>
                <Typography variant="caption" component="span" color="inherit">
                    {label}
                </Typography>
            </Text>
            {buttons.map((b, i)=>(
                <StyledIconButton key={i} onClick={b.onClick} size="small">
                    {b.icon}
                </StyledIconButton>
            ))}

        </SCard>
    );
};

CardMultiButton.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    warn: PropTypes.bool,
};

export default CardMultiButton;

interface Props {
    buttons: {
        icon: React.ReactElement;
        onClick: () => void;
    }[];
    label: string;
    warn: boolean;
}
