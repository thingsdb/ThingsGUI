/* eslint-disable react-hooks/exhaustive-deps */
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';


const HarmonicCardHeader = ({actionButtons, children, expand, onCleanup, onExpand, onRefresh, title, unmountOnExit}) => {
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
                title={title}
                titleTypographyProps={{
                    variant: 'body2',
                    display: 'block',
                    noWrap: true,
                    component: 'span',
                }}
                sx={{
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    '& .MuiCardHeader-action': {
                        marginTop: 0
                    }
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