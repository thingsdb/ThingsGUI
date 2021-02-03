/* eslint-disable react-hooks/exhaustive-deps */
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

const HarmonicCardHeader = ({actionButtons, children, expand, onExpand, onRefresh, title, unmountOnExit}) => {
    const [expanded, setExpanded] = React.useState(expand);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        onExpand(!expanded);
        onRefresh&&!expanded?onRefresh():null;
    };

    const handleRefresh = () => {
        onRefresh();
    };

    React.useEffect(() => {
        if(expand!==expanded){
            setExpanded(expand);
        }
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
                {children}
            </Collapse>
        </Card>
    );
};

HarmonicCardHeader.defaultProps = {
    actionButtons: null,
    expand: false,
    onExpand: ()=>null,
    onRefresh: null,
    unmountOnExit: false,
},

HarmonicCardHeader.propTypes = {
    actionButtons: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    expand: PropTypes.bool,
    onExpand: PropTypes.func,
    onRefresh: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    unmountOnExit: PropTypes.bool,
};

export default HarmonicCardHeader;