/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import {ThingsTree} from '.';


const HarmonicTree = ({items, jsonView, title, onAction, jsonReplacer}) => {
    const [show, setShow] = React.useState(false);

    const handleClick = () => {
        setShow(!show);
    };
    return (
        <List>
            <ListItem>
                <ListItemText primary={title} />
                <ListItemSecondaryAction>
                    <ButtonBase onClick={handleClick} >
                        {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                    </ButtonBase>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={show} timeout="auto" unmountOnExit>
                {!jsonView && Object.entries(items).map(([k, v], i) => (
                    <React.Fragment key={i}>
                        <ThingsTree
                            item={v}
                            child={{
                                name:v.name||k,
                                index:null,
                            }}
                            root={false}
                            onAction={onAction(k)}
                        />
                    </React.Fragment>
                ))}
                {jsonView &&
                    <pre>
                        { JSON.stringify(items, jsonReplacer, 4)}
                    </pre>
                }
            </Collapse>
        </List>
    );
};

HarmonicTree.defaultProps = {
    jsonView: false,
    onAction: ()=>()=>null,
    jsonReplacer: ()=>null,
};

HarmonicTree.propTypes = {
    items: PropTypes.object.isRequired,
    jsonView: PropTypes.bool,
    onAction: PropTypes.func,
    jsonReplacer: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default HarmonicTree;
