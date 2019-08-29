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
import { makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    padding: {
        paddingTop: '4px',
        paddingBottom: '4px',
    },
}));

const HarmonicCard = ({title, content, buttons}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    function handleExpandClick() {
        setExpanded(!expanded);
    }

    return (
        <Card className={classes.padding}>
            <CardHeader
                className={classes.padding}
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
    buttons: null,
},

HarmonicCard.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    buttons: PropTypes.object,
};

export default HarmonicCard;