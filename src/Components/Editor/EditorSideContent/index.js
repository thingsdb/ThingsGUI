import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import Timers from './Timers';
import Procedures from './Procedures';
import EnumsTypes from './EnumsTypes';
import {COLLECTION_SCOPE, NODE_SCOPE} from '../../../Constants/Scopes';


const EditorSideContent = ({scope, onSetQueryInput}) => (
    <React.Fragment>
        {scope.includes(NODE_SCOPE) ? null : (
            <React.Fragment>
                <Grid item xs={12}>
                    <Procedures onSetQueryInput={onSetQueryInput} scope={scope} />
                </Grid>
                <Grid item xs={12}>
                    <Timers onSetQueryInput={onSetQueryInput} scope={scope} />
                </Grid>
            </React.Fragment>
        )}
        {scope.includes(COLLECTION_SCOPE) ? (
            <EnumsTypes onSetQueryInput={onSetQueryInput} scope={scope} />
        ): null}
    </React.Fragment>
);

EditorSideContent.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetQueryInput: PropTypes.func.isRequired,
};

export default EditorSideContent;