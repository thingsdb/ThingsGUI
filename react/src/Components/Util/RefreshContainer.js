import makeStyles from '@mui/styles/makeStyles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

const useStyles = makeStyles(() => ({
    padding: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
}));

const RefreshContainer = ({actionButtons, buttons, content, noPadding, onRefresh}) => {
    const classes = useStyles();

    const handleRefresh = () => {
        onRefresh();
    };

    return (
        <Card>
            <CardHeader
                action={
                    <React.Fragment>
                        {actionButtons}
                        {onRefresh && (
                            <Button color="primary" onClick={handleRefresh}>
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
                <CardActions className={noPadding?classes.padding:null}>
                    {buttons}
                </CardActions>
            ) : null}
        </Card>
    );
};

RefreshContainer.defaultProps = {
    actionButtons: null,
    buttons: null,
    noPadding: false,
    onRefresh: null,
},

RefreshContainer.propTypes = {
    actionButtons: PropTypes.object,
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    noPadding: PropTypes.bool,
    onRefresh: PropTypes.func,
};

export default RefreshContainer;