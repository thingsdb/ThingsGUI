import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

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
                            <IconButton color="primary" onClick={handleRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
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