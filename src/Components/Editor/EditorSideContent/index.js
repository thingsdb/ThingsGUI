import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import Timers from './Timers';
import Procedures from './Procedures';
import EnumsTypes from './EnumsTypes';


const EditorSideContent = ({scope, onSetQueryInput}) => (
    <React.Fragment>
        {scope.includes('@node') ? null : (
            <React.Fragment>
                <Grid item xs={12}>
                    <Procedures onSetQueryInput={onSetQueryInput} scope={scope} />
                </Grid>
                <Grid item xs={12}>
                    <Timers onSetQueryInput={onSetQueryInput} scope={scope} />
                </Grid>
            </React.Fragment>
        )}
        {scope.includes('@collection') ? (
            <EnumsTypes onSetQueryInput={onSetQueryInput} scope={scope} />
        ): null}
    </React.Fragment>
);

EditorSideContent.propTypes = {
    scope: PropTypes.string.isRequired,
    onSetQueryInput: PropTypes.func.isRequired,
};

export default EditorSideContent;