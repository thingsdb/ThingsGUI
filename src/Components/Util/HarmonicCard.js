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
    const [expanded, setExpanded] = React.useState(expand);

    function handleExpandClick() {
        setExpanded(!expanded);
    }

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton onClick={handleExpandClick}>
                        {expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
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
    expand: true,
    buttons: null,
},

HarmonicCard.propTypes = {
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number, PropTypes.bool, PropTypes.string]).isRequired,
    content: PropTypes.object.isRequired,
    buttons: PropTypes.object,
    expand: PropTypes.bool,
};

export default HarmonicCard;