import PropTypes from 'prop-types';
import React from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import {CollectionActions} from '../../Stores/CollectionStore';

import {CSSTransition, TransitionGroup} from 'react-transition-group';



const initialState = {
    contentAdd: "add +",
    width: 100,
    myItems: [],
};

let lastId = -1;

const AddArray = ({collection, thing}) => {
    const [state, setState] = React.useState(initialState);
    const {contentAdd, width, myItems} = state;

    const helperspan = useRef(null);

    React.useEffect(() => {
            console.log('did update, content:', helperspan.current.textContent, 'width', helperspan.current.offsetWidth);
            const helperWidth = helperspan.current.offsetWidth;
            setState({ ...state, width: Math.max(50, helperWidth + 1) });
        },
        [state.contentAdd],
    ); 

    
    console.log(lastId);


	const handleFocus = (_event) => {
		setState({ ...state, contentAdd: "" });
	}
	
	const handleChange = ({target}) => {
        const {value} = target;
		setState({...state, contentAdd: value });
	}

	const handleKeypress = (event) => {
        const {key} = event;
		if (key == "Enter") {

			let currentcontent = contentAdd.trim();
			if (!currentcontent) {
				return; 
            }

			let currentWidth = helperspan.current.offsetWidth;
            setState(prevState => {

                const newArray = prevState.myItems.push({
                    content: currentcontent, 
                    id: ++lastId, 
                    itemWidth: currentWidth + 2
                });
                return {...prevState, contentAdd: "", myItems: newArray};
            });		
		}
	}

	const handleBlur = (_event) => {
		setState({ contentAdd: "add +" });
	}

	const handleClick = ({target}) => {
        const {dataset} = target;
		const idToRemove = Number(dataset["item"]);
		const newArray = myItems.filter((listitem) => {return listitem.id !== idToRemove});
		setState({ ...state, myItems: newArray });
	}
	    

	const makeAddedList = () => {
		
		const elements =  myItems.map((listitem, index) => (
			<li
				key={listitem.id}
				onClick={handleClick}
				data-item={listitem.id}
				style={{
					width: listitem.itemWidth
				}}
			>
				{listitem.content}
			</li>
		));
        return elements
    }


    return (
        <div>
    <TransitionGroup component="ul" className="os-messages">
    {messages.map((message) => (
        <CSSTransition
            key={message.id}
            classNames="message-animation"
            timeout={{
                enter: 300,
                exit: 500,
            }}
        >
            <Message
                message={message}
                onClose={() => this.onClose(message)}
            />
        </CSSTransition>
    ))}
</TransitionGroup>
            <CSSTransitionGroup
                transitionName="item-transition"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={210}
            >
                {makeAddedList()}

            </CSSTransitionGroup>   
            <input
                id="add"
                type="text"
                name="initvalue"
                autoComplete="off"
                maxLength="70"
                onFocus={handleFocus}
                onChange={handleChange}
                onKeyPress={handleKeypress}
                onBlur={handleBlur}
                value={contentAdd}
                style={{ width: width }}
            />

            <span id="helperspan" ref={el => (helperspan)}>
                {contentAdd}
            </span>

        </div>
    );
	
};

AddArray.propTypes = {
    collection: PropTypes.object.isRequired,
    thing: PropTypes.object.isRequired,
};


export default AddArray;


