import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { COLLECTION_SCOPE, NODE_SCOPE } from '../../../Constants/Scopes';
import EnumsTypes from './EnumsTypes';
import Procedures from './Procedures';
import Tasks from './Tasks';


const EditorSideContent = ({scope, onSetQueryInput}) => (
    <React.Fragment>
        {scope.includes(NODE_SCOPE) ? null : (
            <React.Fragment>
                <Grid item xs={12}>
                    <Procedures onSetQueryInput={onSetQueryInput} scope={scope} />
                </Grid>
                <Grid item xs={12}>
                    <Tasks onSetQueryInput={onSetQueryInput} scope={scope} />
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