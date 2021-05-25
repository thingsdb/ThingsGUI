/* eslint-disable react-hooks/exhaustive-deps */
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles(theme => ({
    padding: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    action: {
        marginTop: 0,
    },
}));

const HarmonicCardHeader = ({actionButtons, children, expand, onCleanup, onExpand, onRefresh, title, unmountOnExit}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(expand);

    React.useEffect(() => {
        setExpanded(expand);
    }, [expand]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        onExpand(!expanded);

        if(!expanded) {
            onRefresh();
        } else {
            onCleanup();
        }
    };

    return (
        <Card>
            <CardHeader
                action={
                    <React.Fragment>
                        {expanded && actionButtons}
                        {onRefresh && expanded && (
                            <Button color="primary" onClick={onRefresh}>
                                <RefreshIcon color="primary" />
                            </Button>
                        )}
                        <Button color="primary" onClick={handleExpandClick}>
                            {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                        </Button>
                    </React.Fragment>
                }
                className={classes.padding}
                title={title}
                titleTypographyProps={{
                    variant: 'body2',
                    display: 'block',
                    noWrap: true,
                    component: 'span',
                }}
                classes={{
                    action: classes.action,
                }}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit={unmountOnExit}>
                {children}
            </Collapse>
        </Card>
    );
};

HarmonicCardHeader.defaultProps = {
    actionButtons: null,
    expand: false,
    onCleanup: () => null,
    onExpand: () => null,
    onRefresh: () => null,
    unmountOnExit: false,
},

HarmonicCardHeader.propTypes = {
    actionButtons: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    expand: PropTypes.bool,
    onCleanup: PropTypes.func,
    onExpand: PropTypes.func,
    onRefresh: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    unmountOnExit: PropTypes.bool,
};

export default HarmonicCardHeader;