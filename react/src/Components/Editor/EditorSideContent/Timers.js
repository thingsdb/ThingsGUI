import PropTypes from 'prop-types';
import React from 'react';

import {Timers} from '../../ProceduresAndTimers';


const TimersEditor = ({onSetQueryInput, scope}) => {

    const handleCallback = (type, timer) => {
        switch(type){
        case 'add':
            onSetQueryInput('new_timer(');
            break;
        case 'run':
            if(timer){
                const run = `run(${timer.id})`;
                const input = timer.with_side_effects ? `wse(${run})` : run;
                onSetQueryInput(input);
            }
            break;
        }
    };

    return (
        <Timers
            buttonsView={{add: true, edit: false, run: true, view: true}}
            dialogsView={{add: false, edit: false, run: false, view: true}}
            onCallback={handleCallback}
            scope={scope}
        />

    );
};

TimersEditor.propTypes = {
    onSetQueryInput: PropTypes.func.isRequired,
    scope: PropTypes.string.isRequired,
};

export default TimersEditor;
