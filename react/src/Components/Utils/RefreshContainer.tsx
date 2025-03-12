import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';


const RefreshContainer = ({
    actionButtons = null,
    buttons = null,
    content,
    noPadding = false,
    onRefresh = null,
}) => (
    <Card>
        <CardHeader
            action={
                <React.Fragment>
                    {actionButtons}
                    {onRefresh && (
                        <Button color="primary" onClick={onRefresh}>
                            <RefreshIcon color="primary" />
                        </Button>
                    )}
                </React.Fragment>
            }
        />
        {noPadding ? content : (
            <CardContent>
                {content}
            </CardContent>
        )}
        {buttons ? (
            <CardActions sx={{...(noPadding && {padding: 0})}}>
                {buttons}
            </CardActions>
        ) : null}
    </Card>
);

RefreshContainer.propTypes = {
    actionButtons: PropTypes.object,
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    noPadding: PropTypes.bool,
    onRefresh: PropTypes.func,
};

export default RefreshContainer;