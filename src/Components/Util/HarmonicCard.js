import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

const HarmonicCard = ({actionButtons, buttons, content, expand, noPadding, onRefresh, title, unmountOnExit}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(expand);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        onRefresh&&!expanded?onRefresh():null;
    };

    const handleRefresh = () => {
        onRefresh();
    };

    React.useEffect(() => {
        setExpanded(expand);
    }, [expand]);

    return (
        <Card>
            <CardHeader
                action={
                    <React.Fragment>
                        {expanded && actionButtons}
                        {onRefresh && expanded && (
                            <IconButton color="primary" onClick={handleRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        )}
                        <IconButton color="primary" onClick={handleExpandClick}>
                            {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                        </IconButton>
                    </React.Fragment>
                }
                title={title}
                titleTypographyProps={{
                    variant: 'body1',
                    display: 'block',
                    noWrap: true,
                    component: 'span',
                }}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit={unmountOnExit}>
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
            </Collapse>
        </Card>
    );
};

HarmonicCard.defaultProps = {
    actionButtons: null,
    buttons: null,
    expand: false,
    noPadding: false,
    onRefresh: null,
    unmountOnExit: false,
},

HarmonicCard.propTypes = {
    actionButtons: PropTypes.object,
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    expand: PropTypes.bool,
    noPadding: PropTypes.bool,
    onRefresh: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    unmountOnExit: PropTypes.bool,
};

export default HarmonicCard;