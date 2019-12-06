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


const HarmonicCard = ({title, content, buttons, expand}) => {
    const [expanded, setExpanded] = React.useState(true);

    React.useEffect(() => {
        if (expand!=null) {
            setExpanded(expand);
        }
    }, [expand]);

    function handleExpandClick() {
        setExpanded(!expanded);
    }

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton onClick={handleExpandClick}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                }
                title={title}
                titleTypographyProps={{variant: 'body1'}}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {content}
                </CardContent>
                {buttons ? (
                    <CardActions>
                        {buttons}
                    </CardActions>
                ) : null}
            </Collapse>
        </Card>
    );
};

HarmonicCard.defaultProps = {
    expand: null,
    buttons: null,
},

HarmonicCard.propTypes = {
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    content: PropTypes.object.isRequired,
    buttons: PropTypes.object,
    expand: PropTypes.bool,
};

export default HarmonicCard;