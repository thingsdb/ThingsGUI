import PropTypes from 'prop-types';
import React from 'react';
import Button from '@mui/material/Button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';

import {ThingsTree} from '.';


const HarmonicTree = ({customTypes, items, jsonView, title, onAction, jsonReplacer}) => {
    const [show, setShow] = React.useState(false);

    const handleClick = () => {
        setShow(!show);
    };
    return (
        <List>
            <ListItem>
                <ListItemText primary={title} />
                <ListItemSecondaryAction>
                    <Button color="primary" onClick={handleClick} >
                        {show ? <ExpandMore color="primary" /> : <ChevronRightIcon color="primary" />}
                    </Button>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={show} timeout="auto" unmountOnExit>
                {!jsonView && Object.entries(items).map(([k, v], i) => (
                    <ThingsTree
                        key={i}
                        item={v}
                        child={{
                            name:v.name||k,
                            index:null,
                        }}
                        customTypes={customTypes[k]}
                        root={false}
                        onAction={onAction&&onAction(k)}
                    />
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
    customTypes: {},
    jsonView: false,
    onAction: null,
    jsonReplacer: (k, v)=>v,
};

HarmonicTree.propTypes = {
    customTypes: PropTypes.object,
    items: PropTypes.object.isRequired,
    jsonView: PropTypes.bool,
    onAction: PropTypes.func,
    jsonReplacer: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default HarmonicTree;
