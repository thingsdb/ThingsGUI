import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    padding: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
}));

const HarmonicCard = ({buttons, content, expand, noPadding, onRefresh, title, unmountOnExit}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(expand);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        onRefresh&&!expanded?onRefresh():null;
    };

    React.useEffect(() => {
        setExpanded(expand);
    }, [expand]);

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton onClick={handleExpandClick}>
                        {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    </IconButton>
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
                {noPadding? content : (
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
    buttons: null,
    expand: true,
    noPadding: false,
    onRefresh: null,
    unmountOnExit: true,
},

HarmonicCard.propTypes = {
    buttons: PropTypes.object,
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.arrayOf(PropTypes.object)]).isRequired,
    expand: PropTypes.bool,
    noPadding: PropTypes.bool,
    onRefresh: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    unmountOnExit: PropTypes.bool,
};

export default HarmonicCard;